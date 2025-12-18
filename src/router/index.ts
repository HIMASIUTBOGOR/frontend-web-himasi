import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

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
      {
        name: "dashboard",
        path: "",
        component: () => import("../pages/admin/dashboard/Dashboard.vue"),
      },
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
        name: "users",
        path: "users",
        component: () => import("../pages/users/UsersPage.vue"),
      },
      {
        name: "projects",
        path: "projects",
        component: () => import("../pages/projects/ProjectsPage.vue"),
      },
      {
        name: "payments",
        path: "/payments",
        component: RouteViewComponent,
        children: [
          {
            name: "payment-methods",
            path: "payment-methods",
            component: () => import("../pages/payments/PaymentsPage.vue"),
          },
          {
            name: "billing",
            path: "billing",
            component: () => import("../pages/billing/BillingPage.vue"),
          },
          {
            name: "pricing-plans",
            path: "pricing-plans",
            component: () => import("../pages/pricing-plans/PricingPlans.vue"),
          },
        ],
      },
      {
        name: "faq",
        path: "/faq",
        component: () => import("../pages/faq/FaqPage.vue"),
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

export default router;
