type TicketProperties = {
  hs_pipeline: "0";
  hs_pipeline_stage: "0" | "1" | "2" | "3";
  hs_ticket_priority: "LOW" | "MEDIUM" | "HIGH";
  hubspot_owner_id: string;
  subject: string;
  content: string;
  entry_level: "new" | "med" | "advanced";
};

export type Ticket = {
  id: string;
  properties: TicketProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
};
