import Axios from "axios";
import HubSpotClient from "hubspot-api";
import { APP_CONFIGS } from "../configs";
import { CompanyProperties } from "../types/company";
import { YogaContext } from "../types/custom";
import { createWriteStream } from 'fs';
import { v2 } from 'cloudinary';

const cloudinary = v2;
cloudinary.config({
  api_key: "329246125839327",
  api_secret: "2pj_OP9d_GTj6xNh0ZYc_9vXjoA",
  cloud_name: "mellw"
});

const assertHasCredentials = (ctx: { hs: HubSpotClient }) => {
  if (!ctx.hs) {
    throw new Error("Credentials are required");
  }
};

const storeFile = async ({ stream, filename }: any): Promise<any> => {

  const path = `uploads/${"test"}-${filename}`
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ path }))
      .on('error', reject),
  )
}

const uploadCloudinary = async ({ stream, filename }: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const cldStream = cloudinary.uploader.upload_stream({folder:"mellw_uploads"},function (err, image) {
      console.log("** Stream Upload **");
      if (err) { console.warn(err); }
      console.log("* Same image, uploaded via stream");
      resolve(image)
    });
    stream
      .pipe(cldStream)
      .on('error', reject);
  });
}

export default {
  upload: async (_: any, { file }: any) => {
    console.log("uploading")
    const { createReadStream, filename } = await file
    const stream = createReadStream()
    //const { id, path } = await storeFile({ stream, filename })
    const result = await uploadCloudinary({ stream, filename })
    console.log("cloudinary result : ", result)
    return { filename: "okay" }
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
