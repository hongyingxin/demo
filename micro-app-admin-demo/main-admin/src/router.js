import { createRouter, createWebHistory } from "vue-router"

const routes = [
  { path: "/", component: () => import("./views/Home.vue") },
  { path: "/sub-system/:page*", component: () => import("./views/SubSystemContainer.vue") }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
