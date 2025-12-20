import { Permission } from "../permission/type";

export type Role = {
  id: number;
  name: string;
  guard_name: string;
  permissions: Permission[];
};
