import { createRouter, createWebHistory } from "vue-router"

console.log('sub-admin router',window.__MICRO_APP_BASE_ROUTE__)

const routes = [
  { path: "/", component: () => import("./views/Dashboard.vue") },
  { path: "/users", component: () => import("./views/UserList.vue") },
  { path: "/orders", component: () => import("./views/OrderList.vue") }
]

export default createRouter({
  history: createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || "/"),
  routes
})
