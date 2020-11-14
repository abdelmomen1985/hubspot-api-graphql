import moment from "moment";
import HubspotAPI from "hubspot-api";
import { Context } from "graphql-yoga/dist/types";
import { Client } from "@hubspot/api-client";
export default async ({ request }: any) => {
  const ctx = {
    timestamp: moment().valueOf(),
  } as Context;
  Object.assign(ctx, request.query);

  const { authorization, hapikey } = request.headers;

  if (hapikey) {
    const hs = new HubspotAPI({ hapikey });
    const client = new Client({ apiKey: hapikey });
    Object.assign(ctx, { hs, hapikey, client });
  } else if (authorization) {
    // Access Token passed as header in the format:
    /*
      { 'Authorization': 'Bearer {accessToken}' }
    */
    const accessToken = authorization.slice(7);
    const hs = new HubspotAPI({ accessToken });
    Object.assign(ctx, { hs });
  }
  return ctx;
};
