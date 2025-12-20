import http from "./http";

export const getContentActivities = async () => {
  try {
    const response = await http.get("/api/content/activities");
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch activities";
    throw new Error(msg);
  }
};
export const getContentBenefits = async () => {
  try {
    const response = await http.get("/api/content/benefits");
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch activities";
    throw new Error(msg);
  }
};

export const getContentDepartments = async () => {
  try {
    const response = await http.get("/api/content/departments");
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch departments";
    throw new Error(msg);
  }
};

export const getContentProkers = async () => {
  try {
    const response = await http.get("/api/content/prokers");
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Failed to fetch prokers";
    throw new Error(msg);
  }
};
