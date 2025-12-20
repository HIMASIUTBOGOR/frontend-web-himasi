export type payloiadActivity = {
  image: File | null;
  desc: string;
  is_active: boolean;
  upload_at: Date | string;
};

export type payloadBenefit = {
  photo: File | null;
  title: string;
  desc: string;
};
