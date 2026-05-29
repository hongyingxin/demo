<template>
  <!-- 如果是登录页，不显示侧边栏和顶栏 -->
  <div v-if="$route.name === 'login'" class="login-layout">
    <router-view></router-view>
  </div>

  <el-container v-else class="admin-layout">
    <!-- 左侧侧边栏 -->
    <el-aside :width="isCollapsed ? '64px' : '240px'" class="sidebar">
      <div class="sidebar-header">
        <el-icon :size="24" color="#409eff"><Rocket /></el-icon>
        <span v-show="!isCollapsed" class="logo-text">Admin Pro</span>
      </div>

      <!-- 动态渲染侧边栏菜单 -->
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapsed"
        background-color="#001529"
        text-color="#ffffffb3"
        active-text-color="#fff"
        router
        unique-opened
        class="menu-nav"
      >
        <template v-for="item in menuList" :key="item.title">
          <!-- 有子菜单的情况 -->
          <el-sub-menu v-if="item.children" :index="item.title">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item 
              v-for="sub in item.children" 
              :key="sub.path" 
              :index="sub.path"
            >
              <el-icon v-if="sub.icon && sub.icon.length > 2"><component :is="sub.icon" /></el-icon>
              <span v-else class="menu-custom-icon">{{ sub.icon }}</span>
              <template #title>{{ sub.title }}</template>
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子菜单的情况 -->
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <!-- 右侧主体内容 -->
    <el-container class="main-container">
      <el-header class="main-header">
        <div class="header-left">
          <div class="collapse-trigger" @click="isCollapsed = !isCollapsed">
            <el-icon :size="20">
              <component :is="isCollapsed ? 'Expand' : 'Fold'" />
            </el-icon>
          </div>
          <el-breadcrumb separator="/" class="breadcrumb-nav">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="user-profile">
              <el-avatar :size="32" class="avatar">AD</el-avatar>
              <span class="username">{{ auth.uid || '未登录' }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>

      <el-footer class="main-footer">
        Micro-App Admin Demo &copy; 2026 Powered by NestJS & Element Plus
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import microApp from '@micro-zoe/micro-app'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)
const auth = reactive({
  uid: '',
  ticket: ''
})

// 菜单数据状态
const menuList = ref([])

const currentRouteTitle = computed(() => {
  for (const item of menuList.value) {
    if (item.path === route.path) return item.title
    if (item.children) {
      const sub = item.children.find(s => s.path === route.path)
      if (sub) return sub.title
    }
  }
  return '控制台'
})

// 从后端获取菜单
const fetchMenus = async () => {
  try {
    const response = await axios.get('http://localhost:3000/menus')
    menuList.value = response.data
  } catch (error) {
    console.error('获取菜单失败:', error)
  }
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    if (newPath !== '/login' && !auth.uid) {
      const savedUid = localStorage.getItem('admin_uid')
      const savedTicket = localStorage.getItem('admin_ticket')
      
      if (savedUid && savedTicket) {
        auth.uid = savedUid
        auth.ticket = savedTicket
        microApp.setGlobalData({ uid: auth.uid, ticket: auth.ticket })
        if (menuList.value.length === 0) {
          fetchMenus()
        }
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  const savedUid = localStorage.getItem('admin_uid')
  const savedTicket = localStorage.getItem('admin_ticket')
  if (savedUid && savedTicket) {
    auth.uid = savedUid
    auth.ticket = savedTicket
    microApp.setGlobalData({ uid: auth.uid, ticket: auth.ticket })
    fetchMenus()
  }
})

const logout = () => {
  auth.uid = ''
  auth.ticket = ''
  localStorage.removeItem('admin_uid')
  localStorage.removeItem('admin_ticket')
  microApp.setGlobalData({ uid: null, ticket: null })
  router.push('/login')
}
</script>

<style>
:root {
  --sidebar-bg: #001529;
  --header-height: 60px;
}

body {
  margin: 0;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}

.admin-layout {
  height: 100vh;
}

.sidebar {
  background-color: var(--sidebar-bg);
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.sidebar-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #002140;
  color: white;
  gap: 12px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
}

.menu-nav {
  border-right: none;
  flex: 1;
}

.menu-group-title {
  padding: 15px 20px 5px;
  font-size: 12px;
  color: #ffffff73;
  text-transform: uppercase;
}

.menu-custom-icon {
  margin-right: 12px;
  font-size: 16px;
}

.sidebar-footer {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #002140;
  color: #ffffffb3;
  cursor: pointer;
  border-top: 1px solid #ffffff1a;
}

.sidebar-footer:hover { color: #fff; }

.main-header {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 0 0; /* 调整 padding 给左侧按钮留空间 */
  border-bottom: 1px solid #dcdfe6;
}

.header-left {
  display: flex;
  align-items: center;
  height: 100%;
}

.collapse-trigger {
  padding: 0 20px;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  transition: background 0.3s;
}

.collapse-trigger:hover {
  background: #f9f9f9;
}

.breadcrumb-nav {
  margin-left: 10px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #606266;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}

.main-footer {
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #909399;
  font-size: 12px;
  background: #f0f2f5;
}

/* Transitions */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}
.fade-transform-enter-from { opacity: 0; transform: translateX(-20px); }
.fade-transform-leave-to { opacity: 0; transform: translateX(20px); }

.el-menu-item.is-active {
  background-color: #409eff !important;
}
</style>