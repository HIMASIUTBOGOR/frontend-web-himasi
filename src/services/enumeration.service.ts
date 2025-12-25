import { payloadDepartemen, payloadEnumeration } from "../interfaces/IMaster";
import http from "./http";

export const getEnumeration = async (key: string) => {
  try {
    const response = await http.get("/api/enumeration/byKey", {
      params: {
        key,
      },
    });
    const apiData = response.data;
    return {
      enumeration: apiData.data,
    };
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to fetch enumerations";
    throw new Error(msg);
  }
};

export const getEnumerations = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/enumerations", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      enumerations: apiData.data,
      meta: {
        page: apiData.meta.current_page,
        perPage: apiData.meta.per_page,
        total: apiData.meta.total,
        lastPage: apiData.meta.last_page,
      },
    };
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to fetch enumerations";
    throw new Error(msg);
  }
};

export const createEnumeration = async (data: payloadEnumeration) => {
  try {
    const response = await http.post("/api/enumeration", data);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to create ";
    throw new Error(msg);
  }
};

export const updateEnumeration = async (
  id: string,
  data: payloadEnumeration
) => {
  try {
    const response = await http.put(`/api/enumeration/${id}`, data);
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to update enumeration";
    throw new Error(msg);
  }
};

export const deleteEnumeration = async (id: string) => {
  try {
    await http.delete(`/api/enumeration/${id}`);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to delete the enumeration";
    throw new Error(msg);
  }
};
