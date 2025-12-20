import { Permission } from "../pages/permission/type";
import { User } from "../pages/users/types";

export type GetUsersResponse = {
  users: User[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
  };
};

export type getPermissionResponse = {
  permissions: Permission[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
};

export type payloadPermission = {
  name: string;
  guard_name: string;
};

export type payloadRole = {
  name: string;
  guard_name: string;
  permissions: string[];
};
