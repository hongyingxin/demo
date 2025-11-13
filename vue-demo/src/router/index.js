import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import VModelDemo from '../views/VModelDemo.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/v-model-demo',
    name: 'VModelDemo',
    component: VModelDemo,
    meta: { title: 'V-Model 演示' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Vue 3 示例` : 'Vue 3 示例'
  next()
})

export default router

