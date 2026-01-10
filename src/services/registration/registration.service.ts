import { payloadRegistration } from "../../interfaces/IRegistration";
import http from "../http";

export const createRegistration = async (data: payloadRegistration) => {
  try {
    const response = await http.post("/api/registration", data);
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to create registration";
    throw new Error(msg);
  }
};

export const getRegistrations = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  try {
    const response = await http.get("/api/registrations", {
      params: {
        limit: params?.limit || 10,
        page: params?.page || 1,
        search: params?.search || "",
      },
    });
    const apiData = response.data;
    return {
      registration: apiData.data,
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

export const deleteFaq = async (id: string) => {
  try {
    const response = await http.delete(`/api/registration/${id}`);
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to delete registration";
    throw new Error(msg);
  }
};

export const exportPdf = async (id: string) => {
  try {
    const response = await http.get(`/api/registration/exportPdf/${id}`, {
      responseType: "blob",
    });

    // Create a blob from the PDF data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `registration_${id}.pdf`;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to export PDF";
    throw new Error(msg);
  }
};

export const exportPdfAll = async () => {
  try {
    const response = await http.get("/api/registration/exportPdfAll", {
      responseType: "blob",
    });

    // Create a blob from the PDF data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger download
    const link = document.createElement("a");
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.download = `all_registrations_${timestamp}.pdf`;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to export all PDFs";
    throw new Error(msg);
  }
};
