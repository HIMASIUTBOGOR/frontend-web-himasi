export type childMenu = {
  id: string;
  icon: string | null;
  name: string;
  url: string;
  permission_name: string | null;
  parent_id: string | null;
  order: number;
};

export type Menu = {
  id: string;
  icon: string | null;
  name: string;
  url: string;
  permission_name: string | null;
  parent_id: string | null;
  order: number;
  children: childMenu[];
};
