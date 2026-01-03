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
