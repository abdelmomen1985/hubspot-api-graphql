import Axios from "axios";
import { YogaContext } from "../types/custom";
import { Company } from "../types/company";
import HubSpotClient, { IHubSpotClientProps } from "../types/hubspot-api";
import jwt from "jsonwebtoken";
const assertHasCredentials = (ctx: any) => {
  if (!ctx.hs) {
    throw new Error("Credentials are required");
  }
};

const flattenProps = (properties: any) =>
  Object.keys(properties).reduce((acc: any, curr) => {
    acc[curr] = properties[curr].value;
    return acc;
  }, {});

const contactsResponse = (contact: any) => {
  const { vid, properties } = contact;
  return Object.assign(
    {
      vid,
    },
    flattenProps(properties)
  );
};

const companiesResponse = (company: any) => {
  const { portalId, properties, additionalDomains } = company;
  return Object.assign(
    {
      portalId,
      properties,
    },
    flattenProps(properties)
  );
};

const ZOOM_BEARER_PRE =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ2LUVXSF9uUVNzeWU2UGJ6TjkxY2JnIiwiZXhwIjoxNjM4NTI1MTUwLjM4OSwiaWF0IjoxNjIyNzEzOTUwfQ.b9PZ0TEd0fYNy90SxLwV-";

export default {
  zoom_gen: (_: any, args: any) => {
    const todayDate = new Date();
    const after6Months = new Date(todayDate.setMonth(todayDate.getMonth() + 6));
    const payload = {
      iss: "v-EWH_nQSsye6PbzN91cbg",
      exp: after6Months.getTime() / 1000,
    };
    const token = jwt.sign(payload, args.secret);
    return token;
  },
  hello: (_: any) => "Hello momen 🎉",
  past_meetings: async (_: any, { uuids }: any) => {
    const allReqs = (uuids as String[]).map((uuid) =>
      Axios.get(`https://api.zoom.us/v2/past_meetings/${uuid}`, {
        headers: {
          Authorization: `${ZOOM_BEARER_PRE}Lezgqy2Ch2JCq2NiCo1dZA`,
          "Content-type": "application/json",
        },
        validateStatus: function (status) {
          return true;
        },
      })
    );

    const allFound: any[] = [];
    await Axios.all(allReqs)
      .then((resp) => {
        resp.forEach((item) => {
          console.log(item.data);
          allFound.push({ ...item.data });
        });
      })
      .catch((_errors) => {});

    return allFound;
  },
  contacts: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    // Define extra properties as required by the schema
    const property = ["email", "firstname", "lastname", "company"];
    Object.assign(opts, { property });
    const response = await hs.contacts.getContacts(opts);
    const { contacts } = response;
    return contacts.map(contactsResponse);
  },
  contact: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    const { id, email, utk } = opts;
    let response;
    if (id) {
      response = await hs.contacts.getById(id);
    } else if (email) {
      response = await hs.contacts.getByEmail(email);
    } else if (utk) {
      response = await hs.contacts.getByUtk(utk);
    } else {
      throw new Error(
        "You must specify one of `id`, `email`, `utk` in your query"
      );
    }
    const { vid, properties } = response;
    return contactsResponse(response);
  },
  blog_author: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    const response = await hs.blog.getAuthor(opts.id);
    return response;
  },
  blog_authors: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    const response = await hs.blog.getAuthors(opts);
    const { objects } = response;
    return objects;
  },
  page: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    const response = await hs.pages.getPageById(opts.id);
    return response;
  },
  pages: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    const response = await hs.pages.getPages(opts);
    const { objects } = response;
    return objects;
  },
  blog_post: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    const response = await hs.blog.getPostById(opts);
    return response;
  },
  blog_posts: async (_: any, opts: any, context: any) => {
    const {
      contentGroupId: content_group_id,
      blogAuthorId: blog_author_id,
      limit,
    } = opts;

    assertHasCredentials(context);
    const { hs } = context;
    const response = await hs.blog.getPosts({
      content_group_id,
      blog_author_id,
      limit,
    });
    const { objects } = response;
    return objects;
  },
  workflows: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    const response = await hs.workflows.getAll();
    const { workflows } = response;

    // Filtering (as this is not provided by the API)
    return workflows;
  },
  workflow: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    const response = await hs.workflows.getWorkflow(opts.id);
    console.log(response);
    return response;
  },
  daily_limit: async (_: any, opts: any, context: YogaContext) => {
    assertHasCredentials(context);
    const { hs } = context;
    const accDetails = await hs.account.getAccountDetails();
    return { id: accDetails.portalId, ...accDetails };
  },
  pipelineStages: async (
    _: any,
    { objectType, pipelineId }: any,
    { client }: YogaContext
  ) => {
    const { body: piplineStagesResp } =
      await client.crm.pipelines.pipelineStagesApi.getAll(
        objectType,
        pipelineId
      );
    const stages = piplineStagesResp.results.map((stage) => {
      (stage as any).isClosed = JSON.parse(stage.metadata.isClosed);
      return stage;
    });
    return stages;
  },
  tickets: async (_: any, opts: any, { client }: YogaContext) => {
    /*
    let resp = await Axios(
      `https://api.hubapi.com/crm/v3/objects/tickets?hapikey=${hapikey}`,
      {
        params: {
          properties:
            "subject,content,hs_pipeline_stage,hs_ticket_priority,entry_level",
        },
      }
    );
    return resp.data?.results;
    */

    const { body: piplineStagesResp } =
      await client.crm.pipelines.pipelineStagesApi.getAll("tickets", "0");

    const { results: stages } = piplineStagesResp;
    const tickets = await client.crm.tickets.getAll(100, undefined, [
      "subject,content,hs_pipeline,hs_pipeline_stage,hs_ticket_priority,entry_level",
    ]);
    const ticketsWithStages = tickets.map((ticket: any) => {
      const filteredStages = stages.filter(
        (one) => one.id === ticket.properties.hs_pipeline_stage
      );
      ticket.stage = {
        ...filteredStages[0],
        isClosed: JSON.parse(filteredStages[0].metadata.isClosed),
      };
      return ticket;
    });
    return ticketsWithStages;
  },
  /*
  tasks: async (_: any, opts: any, { hs }: YogaContext) => {
    // https://legacydocs.hubspot.com/docs/methods/engagements/get-all-engagements
    console.log(resp);
  },
  */
  companies: async (_: any, opts: any, { client }: YogaContext) => {
    const companies = await client.crm.companies.getAll(100, undefined, [
      "name_ar,name,description,domain,about_us,phone,linkedin_company_page,website",
    ]);
    const mapped = companies.map((company) => {
      let newCompany = {
        ...company,
        properties: {
          ...company.properties,
          logo: `http://logo.clearbit.com/${company.properties.domain}`,
        },
      };
      return newCompany;
    });
    return mapped;
  },
};
