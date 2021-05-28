/**

  This file is intended to be a starting point, it is not intended to be
  an exhaustive list of attributes that are available in the API. You should
  extend the schemas to include *only* the fields you need in your applications.

  For a full list of available fields for each schema, please check out it's
  corresponding REST API endpoint at https://developers.hubspot.com/docs/overview

*/

type GraphqlMethods = {
  method: string;
  arguments?: any;
  returns: string;
};
let typeDefProps = {
  custom: {
    id: "ID!",
  },
  deleted: {
    statusCode: "Int",
    success: "Boolean",
  },
  contact: {
    vid: "ID!",
    firstname: "String",
    lastname: "String",
    email: "String",
    company: "String",
  },
  page: {
    id: "ID!",
    name: "String",
    css_text: "String",
    widget_containers: "UnparsedObject",
    widgets: "UnparsedObject",
  },
  blog: {
    id: "ID!",
    title: "String!",
    post_body: "String",
    state: "String",
    blog_author_id: "Int",
    archived: "Boolean!",
    campaign: "String",
    campaign_name: "String",
    content_group_id: "Int",
  },
  blogAuthor: {
    avatar: "String",
    bio: "String",
    created: "Int",
    deletedAt: "Int",
    displayName: "String",
    email: "String",
    facebook: "String",
    fullName: "String!",
    googlePlus: "String",
    gravatarUrl: "String",
    hasSocialProfiles: "Boolean",
    id: "ID!",
    linkedin: "String",
    portalId: "Int",
    slug: "String",
    twitter: "String",
    twitterUsername: "String",
    updated: "Int",
    username: "String",
    website: "String",
  },
  workflow: {
    id: "ID",
    name: "String",
    type: "String",
    actions: "UnparsedObject",
    description: "String",
    enabled: "Boolean",
    portalId: "Int",
    isSegmentBased: "Boolean",
    listening: "Boolean",
    nurtureTimeRange: "UnparsedObject",
    onlyExecOnBizDays: "Boolean",
    insertedAt: "Int",
    updatedAt: "Int",
    recurringSetting: "UnparsedObject",
    enrollOnCriteriaUpdate: "Boolean",
    onlyEnrollsManually: "Boolean",
    creationSource: "UnparsedObject",
    updateSource: "UnparsedObject",
    allowContactToTriggerMultipleTimes: "Boolean",
    unenrollmentSetting: "UnparsedObject",
    segmentCriteria: "UnparsedObject",
    goalCriteria: "UnparsedObject",
    reEnrollmentTriggerSets: "UnparsedObject",
    triggerSets: "UnparsedObject",
    suppressionListIds: "UnparsedObject",
    lastUpdatedBy: "String",
    metaData: "UnparsedObject",
  },
  ticketProperties: {
    hs_pipeline: "String",
    hs_pipeline_stage: "String",
    hs_ticket_priority: "String",
    hubspot_owner_id: "String",
    entry_level: "String",
    content: "String",
    subject: "String",
  },
  ticket: {
    id: "ID",
    properties: "TicketProperties",
    createdAt: "String",
    updatedAt: "String",
    archived: "Boolean",
    stage: "PipelineStage",
  },
  companyProperties: {
    name: "String",
    name_ar: "String",
    domain: "String",
    website: "String",
    phone: "String",
    description: "String",
    logo: "String",
  },
  company: {
    id: "ID",
    properties: "CompanyProperties",
    createdAt: "String",
    updatedAt: "String",
    archived: "Boolean",
  },
  pipelineStage: {
    id: "ID",
    createdAt: "String",
    updatedAt: "String",
    archived: "Boolean",
    label: "String",
    isClosed: "Boolean",
  },
};

const mutationFields: GraphqlMethods[] = [
  {
    method: "insert_contact",
    arguments: {
      firstname: "String!",
      email: "String!",
    },
    returns: "Contact!",
  },
  {
    method: "insert_ticket",
    arguments: {
      subject: "String!",
      content: "String",
    },
    returns: "Ticket",
  },
  {
    method: "update_ticket",
    arguments: {
      id: "ID!",
      new_stage_id: "String!",
    },
    returns: "Ticket",
  },
  {
    method: "insert_company",
    arguments: {
      name: "String!",
      name_ar: "String",
      website: "String",
      phone: "String",
    },
    returns: "Company",
  },
  {
    method: "update_company",
    arguments: {
      id: "ID!",
      name: "String",
      name_ar: "String",
      website: "String",
      phone: "String",
    },
    returns: "Company",
  },
  {
    method: "delete_company",
    arguments: { id: "ID!" },
    returns: "Deleted",
  },
  {
    method: "delete_companies",
    arguments: { ids: "[ID!]!" },
    returns: "Deleted",
  },
];

const queryFields: GraphqlMethods[] = [
  {
    method: "page",
    arguments: {
      id: "ID!",
    },
    returns: "Page!",
  },
  {
    method: "pages",
    arguments: {
      offset: "Int",
      limit: "Int!",
    },
    returns: "[Page!]!",
  },
  {
    method: "blog_posts",
    arguments: {
      contentGroupId: "ID!",
      blogAuthorId: "Int",
      limit: "Int!",
    },
    returns: "[BlogPost!]!",
  },
  {
    method: "blog_post",
    arguments: {
      id: "ID!",
    },
    returns: "BlogPost",
  },
  {
    method: "blog_author",
    arguments: {
      id: "ID!",
    },
    returns: "BlogAuthor",
  },
  {
    method: "blog_authors",
    arguments: {
      limit: "Int!",
    },
    returns: "[BlogAuthor!]!",
  },
  {
    method: "version",
    returns: "String!",
  },
  {
    method: "contact",
    arguments: {
      id: "ID",
      email: "String",
      utk: "String",
    },
    returns: "Contact",
  },
  {
    method: "contacts",
    arguments: {
      count: "Int!",
    },
    returns: "[Contact!]!",
  },
  {
    method: "workflow",
    arguments: {
      id: "ID!",
    },
    returns: "Workflow",
  },
  {
    method: "workflows",
    returns: "[Workflow]",
  },
  {
    method: "daily_limit",
    returns: "Custom",
  },
  {
    method: "tickets",
    returns: "[Ticket!]!",
  },
  {
    method: "companies",
    returns: "[Company!]!",
  },
  {
    method: "pipelineStages",
    arguments: {
      objectType: "String!",
      pipelineId: "String!",
    },
    returns: "[PipelineStage]!",
  },
];

const extractQueryMethod = (qf: any) => {
  // blogPosts(contentGroupId: ID!, blogAuthorId: Int, limit: Int!): [BlogPost!]!
  if (qf.arguments) {
    const argumentMap = Object.keys(qf.arguments)
      .map((arg) => `${arg}: ${qf.arguments[arg]}`)
      .join(", ");
    return `${qf.method}(${argumentMap}): ${qf.returns}`;
  }
  return `${qf.method}: ${qf.returns}`;
};

const contactPropertyFields = Object.keys(typeDefProps.contact);
const blogPostFields = Object.keys(typeDefProps.blog);
const blogAuthorFields = Object.keys(typeDefProps.blogAuthor);

Object.keys(typeDefProps).forEach((typeDef) => {
  Object.assign(typeDefProps, {
    [typeDef]: Object.keys((typeDefProps as any)[typeDef])
      .map((prop) => `\t${prop}: ${(typeDefProps as any)[typeDef][prop]}`)
      .join("\r\n"),
  });
});

module.exports = {
  contactPropertyFields,
  blogPostFields,
  blogAuthorFields,
  typeDefs: `
    scalar UnparsedObject
    scalar Upload

    type Query {
      ${queryFields.map(extractQueryMethod).join("\r\n")}
      hello: String
    }

    type Mutation {
      ${mutationFields.map(extractQueryMethod).join("\r\n")}
      upload (file: Upload!): File!
    }

    type File {
      id: ID!
      path: String!
      filename: String!
      mimetype: String!
      encoding: String!
    }

    type Page {
      ${typeDefProps.page}
    }

    type BlogPost {
      ${typeDefProps.blog}
    }

    type Contact {
      ${typeDefProps.contact}
    }

    type BlogAuthor {
      ${typeDefProps.blogAuthor}
    }

    type Workflow {
      ${typeDefProps.workflow}
    }

    type Custom {
      ${typeDefProps.custom}
    }

    type TicketProperties {
      ${typeDefProps.ticketProperties}
    }

    type Ticket {
      ${typeDefProps.ticket}
    }

    type CompanyProperties {
      ${typeDefProps.companyProperties}
    }

    type Company {
      ${typeDefProps.company}
    }

    type Deleted {
      ${typeDefProps.deleted}
    }

    type PipelineStage {
      ${typeDefProps.pipelineStage}
    }
  `,
};
