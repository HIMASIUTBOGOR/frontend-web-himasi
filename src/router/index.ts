import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { getToken, clearAuth } from "../services/config";
import { useAuthStore } from "../stores/auth-store";

import AuthLayout from "../layouts/AuthLayout.vue";
import AppLayout from "../layouts/AppLayout.vue";

import RouteViewComponent from "../layouts/RouterBypass.vue";
import GuestLayout from "../layouts/GuestLayout.vue";

const routes: Array<RouteRecordRaw> = [
  {
    name: "guest",
    path: "/",
    component: GuestLayout,
    children: [
      {
        name: "welcome",
        path: "",
        component: () => import("../pages/guest/welcome/Welcome.vue"),
      },
      {
        name: "Pengurus",
        path: "/pengurus",
        component: () =>
          import("../pages/guest/administration/Administration.vue"),
      },
      {
        name: "Pendaftaran",
        path: "/pendaftaran",
        component: () => import("../pages/guest/registration/Registration.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "dashboard" },
  },
  {
    name: "admin",
    path: "/dashboard",
    component: AppLayout,
    redirect: { name: "dashboard" },
    children: [
      // Dashboard
      {
        name: "dashboard",
        path: "",
        component: () => import("../pages/admin/dashboard/Dashboard.vue"),
      },
      // User Management
      {
        name: "permission",
        path: "user/permission",
        component: () => import("../pages/permission/PermissionPage.vue"),
      },
      {
        name: "role",
        path: "user/role",
        component: () => import("../pages/role/RolePage.vue"),
      },
      {
        name: "users",
        path: "user/user",
        component: () => import("../pages/users/UsersPage.vue"),
      },
      {
        name: "menu",
        path: "user/menu",
        component: () => import("../pages/menu/MenuPage.vue"),
      },

      // Master Data Management
      {
        name: "Enumeration",
        path: "master/enumeration",
        component: () =>
          import("../pages/master/enumeration/EnumerationPage.vue"),
      },

      {
        name: "Departemen",
        path: "master/department",
        component: () =>
          import("../pages/master/departemen/DepartemenPage.vue"),
      },
      {
        name: "Proker",
        path: "master/proker",
        component: () => import("../pages/master/proker/ProkerPage.vue"),
      },
      // CMS Management
      // Here
      {
        name: "Kegitatan",
        path: "cms/activities",
        component: () => import("../pages/cms/activity/ActivityPage.vue"),
      },
      {
        name: "Benefit",
        path: "cms/benefits",
        component: () => import("../pages/cms/benefit/BenefitPage.vue"),
      },

      {
        name: "News",
        path: "cms/news",
        component: () => import("../pages/cms/news/NewsPage.vue"),
      },
      {
        name: "NewsForm",
        path: "cms/news/form",
        component: () => import("../pages/cms/news/NewsFormPage.vue"),
      },

      // Settings & Preferences
      {
        name: "settings",
        path: "settings",
        component: () => import("../pages/settings/Settings.vue"),
      },
      {
        name: "preferences",
        path: "preferences",
        component: () => import("../pages/preferences/Preferences.vue"),
      },
      {
        name: "faq",
        path: "cms/faq",
        component: () => import("../pages/cms/faq/FaqPage.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        name: "login",
        path: "login",
        component: () => import("../pages/auth/Login.vue"),
      },
      {
        path: "",
        redirect: { name: "login" },
      },
    ],
  },
  {
    name: "404",
    path: "/404",
    component: () => import("../pages/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    } else {
      window.scrollTo(0, 0);
    }
  },
  routes,
});

router.beforeEach(async (to) => {
  const tokenPresent = Boolean(getToken());
  const auth = useAuthStore();

  // Guard all dashboard routes
  if (to.path.startsWith("/dashboard")) {
    if (!tokenPresent) {
      return { name: "login", query: { redirect: to.fullPath } };
    }

    // Validate token by loading /api/auth/me
    try {
      await auth.loadMe(true);
    } catch (e) {
      clearAuth();
      return { name: "login", query: { redirect: to.fullPath } };
    }
  }

  // If already authenticated (valid) prevent going to login
  if (to.name === "login" && tokenPresent) {
    try {
      await auth.loadMe(true);
      return { name: "dashboard" };
    } catch {
      // invalid token, allow to proceed to login
      clearAuth();
      return;
    }
  }
});

export default router;
