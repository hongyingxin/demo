import { createRouter, createWebHistory } from 'vue-router'
import MainHome from './views/MainHome.vue'
import SubAppContainer from './views/SubAppContainer.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainHome
  },
  {
    // 子应用对应的路由，所有以 /sub-app 开头的路径都会走这个组件
    path: '/sub-app/:page*',
    name: 'sub-app',
    component: SubAppContainer
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router