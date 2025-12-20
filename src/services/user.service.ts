import http from "./http";
import { payloadPermission, payloadRole } from "../interfaces/IUser";

export const getUsers = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/users", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      users: apiData.data,
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

export const createUser = async (data: FormData) => {
  try {
    const response = await http.post("/api/user", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to create user";
    throw new Error(msg);
  }
};

export const updateUser = async (id: number, data: FormData) => {
  try {
    // Use POST with _method for Laravel to handle file uploads in PUT requests
    data.append("_method", "PUT");
    const response = await http.post(`/api/user/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to update user";
    throw new Error(msg);
  }
};

export const deleteUser = async (id: number) => {
  try {
    await http.delete(`/api/user/${id}`);
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to delete the user";
    throw new Error(msg);
  }
};

export const getRoles = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/roles", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      roles: apiData.data,
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

export const createRole = async (data: payloadRole) => {
  try {
    const response = await http.post("/api/role", data);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to create role";
    throw new Error(msg);
  }
};

export const updateRole = async (id: number, data: payloadRole) => {
  try {
    const response = await http.put(`/api/role/${id}`, data);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to update role";
    throw new Error(msg);
  }
};

export const deleteRole = async (id: number) => {
  try {
    await http.delete(`/api/role/${id}`);
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to delete the role";
    throw new Error(msg);
  }
};

export const getPermission = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
  type?: string;
}) => {
  try {
    const response = await http.get("/api/permissions", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
        type: params?.type || "",
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

export const getMenu = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/menus", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      menu: apiData.data,
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
