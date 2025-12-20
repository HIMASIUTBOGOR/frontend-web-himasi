import http from "./http";

export const getEnumeration = async (key: string) => {
  try {
    const response = await http.get("/api/enumerations", {
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
