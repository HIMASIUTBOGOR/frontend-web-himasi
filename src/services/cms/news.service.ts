// Kegiatan Services

import http from "../http";
import { payloadNews } from "../../interfaces/ICms";

export const getNews = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/news", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      news: apiData.data,
      meta: {
        page: apiData.meta.current_page,
        perPage: apiData.meta.per_page,
        total: apiData.meta.total,
        lastPage: apiData.meta.last_page,
      },
    };
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch news";
    throw new Error(msg);
  }
};

export const getNewses = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  return getNews(params);
};

export const createNews = async (data: payloadNews) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("author", data.author);
    formData.append("category_id", data.category_id);
    formData.append("is_active", data.is_active ? "1" : "0");
    formData.append("published_at", String(data.published_at));
    if (data.photo instanceof File) {
      formData.append("photo", data.photo);
    }

    const response = await http.post("/api/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to create news";
    throw new Error(msg);
  }
};

export const getNewsById = async (id: string) => {
  try {
    const response = await http.get(`/api/news/${id}`);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch news";
    throw new Error(msg);
  }
};

export const updateNews = async (id: string, data: payloadNews) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("author", data.author);
    formData.append("category_id", data.category_id);
    formData.append("is_active", data.is_active ? "1" : "0");
    formData.append("published_at", String(data.published_at));
    if (data.photo instanceof File) {
      formData.append("photo", data.photo);
    }

    const response = await http.put(`/api/news/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to update news";
    throw new Error(msg);
  }
};

export const deleteNews = async (id: string) => {
  try {
    await http.delete(`/api/news/${id}`);
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to delete the news";
    throw new Error(msg);
  }
};
