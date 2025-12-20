// Kegiatan Services

import http from "../http";
import { payloiadActivity } from "../../interfaces/ICms";

export const getActivities = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/activities", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      activities: apiData.data,
      meta: {
        page: apiData.meta.current_page,
        perPage: apiData.meta.per_page,
        total: apiData.meta.total,
        lastPage: apiData.meta.last_page,
      },
    };
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch activities";
    throw new Error(msg);
  }
};

export const createActivity = async (data: payloiadActivity) => {
  try {
    const formData = new FormData();
    formData.append("desc", data.desc);
    formData.append("is_active", data.is_active ? "1" : "0");
    if (data.image) {
      formData.append("image", data.image);
    }
    // Convert Date to ISO string for backend
    const uploadDate =
      data.upload_at instanceof Date
        ? data.upload_at.toISOString().split("T")[0]
        : data.upload_at;
    formData.append("upload_at", uploadDate);

    const response = await http.post("/api/activity", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to create activity";
    throw new Error(msg);
  }
};

export const updateActivity = async (id: string, data: payloiadActivity) => {
  try {
    const formData = new FormData();
    formData.append("desc", data.desc);
    formData.append("is_active", data.is_active ? "1" : "0");
    if (data.image) {
      formData.append("image", data.image);
    }
    // Convert Date to ISO string for backend
    const uploadDate =
      data.upload_at instanceof Date
        ? data.upload_at.toISOString().split("T")[0]
        : data.upload_at;
    formData.append("upload_at", uploadDate);
    // Use POST with _method for Laravel to handle file uploads in PUT requests
    formData.append("_method", "PUT");

    const response = await http.post(`/api/activity/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to update activity";
    throw new Error(msg);
  }
};

export const deleteActivity = async (id: string) => {
  try {
    await http.delete(`/api/activity/${id}`);
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to delete the activity";
    throw new Error(msg);
  }
};
