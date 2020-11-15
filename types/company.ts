export type CompanyProperties = {
  hs_object_id: string;
  name: string;
  domain: string;
  phone: string;
  description: string;
  logo: string;
  website: string;
};

export type Company = {
  id: string;
  properties: CompanyProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
};
