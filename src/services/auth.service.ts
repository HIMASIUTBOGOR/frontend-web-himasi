import { setAuth } from "./config";
import http from "./http";

export type SignInPayload = {
  nim: string;
  password: string;
};

export type SignInResponse = {
  message: string;
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    nim: string;
    email: string;
    email_verified_at: string | null;
    jabatan_id: string | null;
    avatar: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
};

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  try {
    const { data } = await http.post<SignInResponse>(
      "/api/auth/sign-in",
      payload,
    );
    setAuth(data.access_token, data.token_type, data.user);
    return data;
  } catch (e: any) {
    const msg = e?.response?.data?.message || "Failed to sign in";
    throw new Error(msg);
  }
}

export type MeResponse = {
  user: SignInResponse["user"];
  roles: string[];
  permissions: string[];
  menus: Array<{
    id: string;
    icon: string | null;
    name: string;
    url: string;
    permission_name: string | null;
    parent_id: string | null;
    order: number;
    created_at: string;
    updated_at: string;
    children?: MeResponse["menus"];
  }>;
};

export async function fetchMe(): Promise<MeResponse> {
  try {
    const { data } = await http.get<MeResponse>("/api/auth/me");
    return data;
  } catch (e: any) {
    const msg = e?.response?.data?.message || "Failed to fetch profile";
    throw new Error(msg);
  }
}

export async function signOut(): Promise<void> {
  try {
    await http.post("/api/auth/sign-out");
  } catch {
    // ignore network errors on logout
  }
}
