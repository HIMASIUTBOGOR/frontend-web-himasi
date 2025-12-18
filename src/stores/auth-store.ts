import { defineStore } from "pinia";
import { getToken, getTokenType } from "../services/config";
import { fetchMe } from "../services/auth.service";

export type MenuItem = {
  id: string;
  icon: string | null;
  name: string;
  url: string;
  permission_name: string | null;
  parent_id: string | null;
  order: number;
  created_at: string;
  updated_at: string;
  children?: MenuItem[];
};

type User = {
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

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    roles: [] as string[],
    permissions: [] as string[],
    menus: [] as MenuItem[],
    loaded: false,
  }),
  getters: {
    isAuthenticated: () => Boolean(getToken()),
    authHeader: () => {
      const token = getToken();
      const type = getTokenType();
      return token ? { Authorization: `${type} ${token}` } : {};
    },
  },
  actions: {
    async loadMe(force = false) {
      if (this.loaded && !force) return;
      const token = getToken();
      if (!token) {
        this.user = null;
        this.roles = [];
        this.permissions = [];
        this.menus = [];
        this.loaded = true;
        return;
      }

      const data = await fetchMe();
      this.user = data.user;
      this.roles = data.roles || [];
      this.permissions = data.permissions || [];
      // ensure children arrays exist
      const normalize = (items: MenuItem[]): MenuItem[] =>
        (items || []).map((m) => ({
          ...m,
          children: normalize(m.children || []),
        }));
      this.menus = normalize(data.menus || []);
      this.loaded = true;
    },
  },
});
