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

export type payloadNews = {
  photo: File | null;
  title: string;
  category_id: string;
  desc: string;
  is_active: boolean;
  author: string;
  published_at: Date | string;
};
