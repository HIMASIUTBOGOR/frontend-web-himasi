import http from "./http";
import { User } from "../pages/users/types";

export type ApiResponse = {
  status: string;
  data: User[];
};

export type GetUsersResponse = {
  users: User[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
  };
};

export const getUsers = async (): Promise<GetUsersResponse> => {
  try {
    const response = await http.get("/api/users");
    const apiData = response.data as ApiResponse;

    // Transform data to add computed properties
    const users = apiData.data.map((user: User) => ({
      ...user,
      fullname: user.name,
      username: user.nim,
      role: user.roles?.[0]?.name || "user",
      active: true,
      projects: [],
      notes: "",
    }));

    return {
      users,
      pagination: {
        page: 1,
        perPage: 10,
        total: users.length,
      },
    };
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch users";
    throw new Error(msg);
  }
};
