import { createRouter, createWebHistory } from "vue-router"

const routes = [
  { path: "/login", name: "login", component: () => import("./views/Login.vue") },
  { path: "/", name: "home", component: () => import("./views/Home.vue") },
  { path: "/sub-system/:page*", component: () => import("./views/SubSystemContainer.vue") },
  { path: "/pure-html/:page*", component: () => import("./views/PureHtmlContainer.vue") }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：未登录拦截
router.beforeEach((to, from, next) => {
  const uid = localStorage.getItem('admin_uid')
  if (to.name !== 'login' && !uid) {
    next({ name: 'login' })
  } else if (to.name === 'login' && uid) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
