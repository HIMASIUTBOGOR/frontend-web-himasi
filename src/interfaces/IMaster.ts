export type payloadDepartemen = {
  icon: string;
  title: string;
  desc: string;
};
export type payloadProker = {
  departemen_id: string;
  photo: string;
  title: string;
  desc: string;
  action_link?: string;
  is_active: boolean;
};

export type payloadEnumeration = {
  key: string;
  value: string;
};
