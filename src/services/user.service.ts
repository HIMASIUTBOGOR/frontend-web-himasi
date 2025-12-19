import http from "./http";
import { ApiResponse } from "../interfaces/IApi";
import { GetUsersResponse, payloadPermission } from "../interfaces/IUser";
import { User } from "../pages/users/types";

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

export const getPermission = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/permissions", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      permissions: apiData.data,
      meta: {
        page: apiData.meta.current_page,
        perPage: apiData.meta.per_page,
        total: apiData.meta.total,
        lastPage: apiData.meta.last_page,
      },
    };
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch permissions";
    throw new Error(msg);
  }
};

export const createPermission = async (data: payloadPermission) => {
  try {
    const response = await http.post("/api/permission", data);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to create permission";
    throw new Error(msg);
  }
};

export const updatePermission = async (id: number, data: payloadPermission) => {
  try {
    const response = await http.put(`/api/permission/${id}`, data);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to update permission";
    throw new Error(msg);
  }
};

export const deletePermission = async (id: number) => {
  try {
    await http.delete(`/api/permission/${id}`);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to delete the permission";
    throw new Error(msg);
  }
};
