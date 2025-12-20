// Kegiatan Services

import http from "../http";
import { payloadBenefit } from "../../interfaces/ICms";
import { payloadDepartemen } from "../../interfaces/IMaster";

export const getDepartemens = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/departments", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      departments: apiData.data,
      meta: {
        page: apiData.meta.current_page,
        perPage: apiData.meta.per_page,
        total: apiData.meta.total,
        lastPage: apiData.meta.last_page,
      },
    };
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch departemens";
    throw new Error(msg);
  }
};

export const createDepartemen = async (data: payloadDepartemen) => {
  try {
    const response = await http.post("/api/department", data);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to create ";
    throw new Error(msg);
  }
};

export const updateDepartemen = async (id: string, data: payloadDepartemen) => {
  try {
    const response = await http.put(`/api/department/${id}`, data);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to update department";
    throw new Error(msg);
  }
};

export const deleteDepartemen = async (id: string) => {
  try {
    await http.delete(`/api/department/${id}`);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to delete the department";
    throw new Error(msg);
  }
};
