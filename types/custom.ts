import { Client } from "@hubspot/api-client";
import HubSpotClient from "./hubspot-api";

export type YogaContext = {
  hs: HubSpotClient;
  hapikey: string;
  client: Client;
};
