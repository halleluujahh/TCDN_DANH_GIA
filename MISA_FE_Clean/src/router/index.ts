import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../layout/AppLayout.vue"),
      children: [
        {
          path: "",
          redirect: "/development/dictionary/shift",
        },
        {
          path: "/development/dictionary/shift",
          name: "shift-management",
          component: () => import("../views/shift/ShiftManagement.vue"),
        },
      ],
    },
  ],
});

export default router;
