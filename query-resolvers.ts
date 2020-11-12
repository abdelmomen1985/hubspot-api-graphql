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

export default {
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
  blogAuthor: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    const response = await hs.blog.getAuthor(opts.id);
    return response;
  },
  blogAuthors: async (_: any, opts: any, context: any) => {
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
  blogPost: async (_: any, opts: any, context: any) => {
    assertHasCredentials(context);
    const { hs } = context;
    const response = await hs.blog.getPostById(opts);
    return response;
  },
  blogPosts: async (_: any, opts: any, context: any) => {
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
};
