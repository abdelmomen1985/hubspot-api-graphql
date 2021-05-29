import { GraphQLServer } from "graphql-yoga";
import UnparsedObject from "graphql-type-json";
import Query from "./resolvers/query-resolvers";
import Mutation from "./resolvers/mutation-resolvers";
import context from "./context";
import fileUpload from "express-fileupload";
import streamifier from "streamifier";
import { v2 } from "cloudinary";

const cloudinary = v2;
cloudinary.config({
  api_key: "329246125839327",
  api_secret: "2pj_OP9d_GTj6xNh0ZYc_9vXjoA",
  cloud_name: "mellw",
});

require("dotenv").config();

const typeDefs = require("./schemas/hubspot.graphql").typeDefs;
const resolvers = { Query, Mutation, UnparsedObject };
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context,
});

const { PORT: port, NODE_ENV } = process.env;

server.express.use(fileUpload());

server.express.get("/hello", (req, res) => {
  res.send("Hello hello hello 🎉");
});

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

server.express.post("/upload", async (req, res) => {
  const { files } = req;
  if (files && files.single) {
    const { data, name } = files.single as fileUpload.UploadedFile;
    const stream = streamifier.createReadStream(data);
    //const { id, path } = await storeFile({ stream, filename })
    const result = await uploadCloudinary({ stream, name });
    console.log(result);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.json(result);
  }
});

server.start(
  {
    cors: {
      credentials: true,
      origin: "*",
    },
    port,
    endpoint: `/api/v1`,
    tracing: NODE_ENV === "development",
    cacheControl: true,
  },
  ({ port }) =>
    console.log(
      `Server started, listening on port http://localhost:${port} for incoming requests.`
    )
);
