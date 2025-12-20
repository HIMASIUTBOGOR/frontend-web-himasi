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
