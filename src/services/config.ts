export const SERVER_URL = (import.meta.env.VITE_SERVER_URL || "").toString();

export const apiUrl = (path: string) => {
  const base = SERVER_URL.replace(/\/$/, "");
  const p = path.replace(/^\//, "");
  return `${base}/${p}`;
};

export const AUTH_TOKEN_KEY = "auth_access_token";
export const AUTH_TOKEN_TYPE_KEY = "auth_token_type";
export const AUTH_USER_KEY = "auth_user";

export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const getTokenType = () =>
  localStorage.getItem(AUTH_TOKEN_TYPE_KEY) || "Bearer";

export const setAuth = (token: string, tokenType: string, user: unknown) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_TOKEN_TYPE_KEY, tokenType || "Bearer");
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_TYPE_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};
