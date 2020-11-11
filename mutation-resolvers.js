
/** @typedef {import('hubspot-api')} HubSpotClient */

const assertHasCredentials = ctx => {
  if (!ctx.hs) {
    throw new Error('Credentials are required');
  }
};

const debug = require('debug')('hubspot-gql');

module.exports = {
  createContact: async (_, req , context) => {
    assertHasCredentials(context);
    console.log(req);
    const { firstname, email } = req;
    /** @type {HubSpotClient} */
    const hs = context.hs;
    try {
      await hs.contacts.createOrUpdateContact({ firstname, email });
      // then get contact by email
      const response = await hs.contacts.getByEmail(email)
      debug(response);
      const {vid} = response;
      return {vid};
    } catch (error) {
      debug(error)
    }

  }
}