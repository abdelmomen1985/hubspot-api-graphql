import Axios from "axios";
import HubSpotClient from "hubspot-api";
import { APP_CONFIGS } from "../configs";
import { CompanyProperties } from "../types/company";
import { YogaContext } from "../types/custom";
import { createWriteStream } from "fs";
import { v2 } from "cloudinary";
import sgMail from "@sendgrid/mail";

const cloudinary = v2;
const CLDRY_SECRET_PRE = "2pj_OP9d_GTj6xNh0ZYc_";
cloudinary.config({
  api_key: "329246125839327",
  api_secret: `${CLDRY_SECRET_PRE}9vXjoA`,
  cloud_name: "mellw",
});
const SG_KEY_PRE = "SG.g7dFD3puQLizwmk-2FgfgQ.";
sgMail.setApiKey(`${SG_KEY_PRE}iJLaRGQBZWpec5gZk9lzubPLkbglYMJHba3GAAzL6KY`);

const assertHasCredentials = (ctx: { hs: HubSpotClient }) => {
  if (!ctx.hs) {
    throw new Error("Credentials are required");
  }
};

const storeFile = async ({ stream, filename }: any): Promise<any> => {
  const path = `uploads/${"test"}-${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ path }))
      .on("error", reject)
  );
};

const uploadCloudinary = async ({ stream, filename }: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const cldStream = cloudinary.uploader.upload_stream(
      { folder: "mellw_uploads" },
      function (err, image) {
        console.log("** Stream Upload **");
        if (err) {
          console.warn(err);
        }
        console.log("* Same image, uploaded via stream");
        resolve(image);
      }
    );
    stream.pipe(cldStream).on("error", reject);
  });
};

export default {
  upload: async (_: any, { file }: any) => {
    console.log("uploading");
    const { createReadStream, filename } = await file;
    const stream = createReadStream();
    //const { id, path } = await storeFile({ stream, filename })
    const result = await uploadCloudinary({ stream, filename });
    console.log("cloudinary result : ", result);
    return { filename: "okay" };
  },
  create_meeting: async (_: any, { topic, type }: any) => {
    console.log("creating meeting ...");
    topic = topic ? topic : "Mellw's Meeting";
    type = type ? type : 1;
    const ZOOM_BEARER_PRE =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ2LUVXSF9uUVNzeWU2UGJ6TjkxY2JnIiwiZXhwIjoxNjM4NTI1MTUwLjM4OSwiaWF0IjoxNjIyNzEzOTUwfQ.b9PZ0TEd0fYNy90SxLwV-";
    try {
      const resp = await Axios.post(
        `https://api.zoom.us/v2/users/c9IXVNdRT82n90hZQ9Iuaw/meetings`,
        {
          topic,
          type,
        },
        {
          headers: {
            Authorization: `${ZOOM_BEARER_PRE}Lezgqy2Ch2JCq2NiCo1dZA`,
            "Content-type": "application/json",
          },
        }
      );
      console.log(resp.data);
      const msg = {
        to: "abdelmomen1985@gmail.com", // Change to your recipient
        from: "info@mellw.com", // Change to your verified sender
        subject: "New Zoom meeting request",
        text: `Meeting url is ${resp.data.join_url}`,
        html: `<strong>Meeting url is</strong> ${resp.data.join_url}`,
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
      return resp.data;
    } catch (error) {
      console.error(error.response?.data);
    }
  },
  insert_contact: async (_: any, req: any, context: YogaContext) => {
    assertHasCredentials(context);
    const { firstname, email } = req;
    const hs = context.hs;
    try {
      await hs.contacts.createOrUpdateContact({ firstname, email });
      // then get contact by email
      const response = await hs.contacts.getByEmail(email);
      console.log("response: ", response);
      const { vid } = response;
      return { vid };
    } catch (error) {
      console.error("error: ", error);
    }
  },
  insert_ticket: async (_: any, req: any, { hapikey }: YogaContext) => {
    try {
      const resp = await Axios.post(
        `https://api.hubapi.com/crm/v3/objects/tickets?hapikey=${hapikey}`,
        {
          properties: {
            hs_pipeline_stage: "1",
            hubspot_owner_id: APP_CONFIGS.MAIN_OWNER,
            ...req,
          },
        }
      );
      console.log(resp.data);
    } catch (error) {
      console.error(error.response?.data);
    }
  },
  update_ticket: async (
    _: any,
    { id, new_stage_id }: any,
    { client }: YogaContext
  ) => {
    let resp = await client.crm.tickets.basicApi.update(id, {
      properties: { hs_pipeline_stage: new_stage_id },
    });
    console.log(resp);
  },
  insert_company: async (_: any, req: any, { client }: YogaContext) => {
    let properties = { ...req } as CompanyProperties;
    let company = await client.crm.companies.basicApi.create({
      properties,
    });
    return company.body;
  },
  update_company: async (_: any, req: any, { client }: YogaContext) => {
    const { id } = req;
    delete req.id;
    let properties = { ...req } as CompanyProperties;
    console.log("update_company", id, properties);
    let updated = await client.crm.companies.basicApi.update("" + id, {
      properties,
    });
    console.log(updated);
  },
  delete_company: async (_: any, req: any, { client }: YogaContext) => {
    const { id } = req;
    const deleted = await client.crm.companies.basicApi.archive(id);

    return {
      statusCode: deleted.response.statusCode,
      success: deleted.response.statusCode === 204,
    };
  },
  delete_companies: async (_: any, { ids }: any, { client }: YogaContext) => {
    let batchIds = (ids as string[]).map((id) => {
      return { id };
    });

    try {
      const deleted = await client.crm.companies.batchApi.archive({
        inputs: batchIds,
      });
      console.log(deleted.response.statusCode);
      return {
        statusCode: deleted.response.statusCode,
        success: deleted.response.statusCode === 204,
      };
    } catch (error) {
      console.error(error.message);
      return {
        success: false,
      };
    }
  },
};
