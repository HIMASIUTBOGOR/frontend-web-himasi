// Kegiatan Services

import http from "../http";
import { payloadProker } from "../../interfaces/IMaster";

export const getProkers = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/prokers", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      proker: apiData.data,
      meta: {
        page: apiData.meta.current_page,
        perPage: apiData.meta.per_page,
        total: apiData.meta.total,
        lastPage: apiData.meta.last_page,
      },
    };
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch prokers";
    throw new Error(msg);
  }
};

export const createProker = async (data: payloadProker) => {
  try {
    const formData = new FormData();
    formData.append("departemen_id", data.departemen_id);
    formData.append("desc", data.desc);
    formData.append("title", data.title);
    formData.append("action_link", data.action_link || "");
    formData.append("is_active", data.is_active ? "1" : "0");
    if (data.photo) {
      formData.append("photo", data.photo);
    }
    const response = await http.post("/api/proker", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to create proker";
    throw new Error(msg);
  }
};

export const updateProker = async (id: string, data: payloadProker) => {
  try {
    const formData = new FormData();
    formData.append("departemen_id", data.departemen_id);
    formData.append("desc", data.desc);
    formData.append("title", data.title);
    formData.append("is_active", data.is_active ? "1" : "0");
    if (data.photo) {
      formData.append("photo", data.photo);
    }
    formData.append("_method", "PUT");

    const response = await http.put(`/api/proker/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to update proker";
    throw new Error(msg);
  }
};

export const deleteProker = async (id: string) => {
  try {
    await http.delete(`/api/proker/${id}`);
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to delete the proker";
    throw new Error(msg);
  }
};
