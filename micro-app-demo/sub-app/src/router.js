import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

const router = createRouter({
  // 当在 micro-app 中运行时，可能需要设置基础路径
  history: createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || '/'),
  routes
})

export default router