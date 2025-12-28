// Kegiatan Services

import http from "../http";
import { payloadBenefit, payloadFaq } from "../../interfaces/ICms";
import { payloadDepartemen } from "../../interfaces/IMaster";

export const getFaq = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/faqs", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      faqs: apiData.data,
      meta: {
        page: apiData.meta.current_page,
        perPage: apiData.meta.per_page,
        total: apiData.meta.total,
        lastPage: apiData.meta.last_page,
      },
    };
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch faqs";
    throw new Error(msg);
  }
};

export const createFaq = async (data: payloadFaq) => {
  try {
    const response = await http.post("/api/faq", data);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to create ";
    throw new Error(msg);
  }
};

export const updateFaq = async (id: string, data: payloadFaq) => {
  try {
    const response = await http.put(`/api/faq/${id}`, data);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to update faq";
    throw new Error(msg);
  }
};

export const deleteFaq = async (id: string) => {
  try {
    await http.delete(`/api/faq/${id}`);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to delete the department";
    throw new Error(msg);
  }
};
