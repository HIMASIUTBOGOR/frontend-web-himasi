// Kegiatan Services

import http from "../http";
import { payloadBenefit } from "../../interfaces/ICms";

export const getBenefits = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/benefits", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      benefits: apiData.data,
      meta: {
        page: apiData.meta.current_page,
        perPage: apiData.meta.per_page,
        total: apiData.meta.total,
        lastPage: apiData.meta.last_page,
      },
    };
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch benefits";
    throw new Error(msg);
  }
};

export const createBenefit = async (data: payloadBenefit) => {
  try {
    const formData = new FormData();
    formData.append("desc", data.desc);
    formData.append("title", data.title);
    if (data.photo) {
      formData.append("photo", data.photo);
    }
    const response = await http.post("/api/benefit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to create benefit";
    throw new Error(msg);
  }
};

export const updateBenefit = async (id: string, data: payloadBenefit) => {
  try {
    const formData = new FormData();
    formData.append("desc", data.desc);
    formData.append("title", data.title);
    if (data.photo) {
      formData.append("photo", data.photo);
    }
    formData.append("_method", "PUT");

    const response = await http.put(`/api/benefit/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to update benefit";
    throw new Error(msg);
  }
};

export const deleteBenefit = async (id: string) => {
  try {
    await http.delete(`/api/benefit/${id}`);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to delete the benefit";
    throw new Error(msg);
  }
};
