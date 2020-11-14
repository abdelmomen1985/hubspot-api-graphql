import Axios from "axios";
import HubSpotClient from "hubspot-api";
import { APP_CONFIGS } from "./configs";
import { YogaContext } from "./types/custom";

const assertHasCredentials = (ctx: { hs: HubSpotClient }) => {
  if (!ctx.hs) {
    throw new Error("Credentials are required");
  }
};

export default {
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
};
