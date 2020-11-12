import HubSpotClient from "hubspot-api";

const assertHasCredentials = (ctx: { hs: HubSpotClient }) => {
  if (!ctx.hs) {
    throw new Error("Credentials are required");
  }
};

export default {
  createContact: async (_: any, req: any, context: { hs: HubSpotClient }) => {
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
};
