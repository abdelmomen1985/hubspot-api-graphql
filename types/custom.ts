import HubSpotClient from "./hubspot-api";

export type YogaContext = {
  hs: HubSpotClient;
  hapikey: string;
};
