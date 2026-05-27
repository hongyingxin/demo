<template>
  <div class="sub-app-layout">
    <div v-if="!isMicroApp" class="sub-sidebar">
      <h3>独立运行模式菜单</h3>
      <router-link to="/">Dashboard</router-link>
      <router-link to="/users">Users</router-link>
      <router-link to="/orders">Orders</router-link>
    </div>
    <div class="sub-content">
      <div v-if="auth.uid" style="background: #e1f3d8; padding: 10px; margin-bottom: 20px; border-radius: 4px; border: 1px solid #67c23a;">
        🔐 <strong>子应用已同步登录态：</strong> UID: {{ auth.uid }} | Ticket: {{ auth.ticket }}
      </div>
      <div v-else style="background: #fef0f0; padding: 10px; margin-bottom: 20px; border-radius: 4px; border: 1px solid #f56c6c;">
        🔒 <strong>子应用未登录：</strong> 请在主应用进行登录
      </div>
      
      <div v-if="auth.uid" style="margin-bottom: 20px;">
        <button @click="simulate401" style="background: #e6a23c; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
          模拟 401 错误 (通知主应用登出)
        </button>
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'

const isMicroApp = window.__MICRO_APP_ENVIRONMENT__

const auth = reactive({
  uid: '',
  ticket: ''
})

// 模拟 401 错误
const simulate401 = () => {
  if (window.microApp) {
    console.log('[子应用] 发送 401 指令给主应用')
    window.microApp.dispatch({ type: 'UNAUTHORIZED' })
  }
}

// 监听全局数据变化
const handleGlobalData = (data) => {
  console.log('子应用收到全局数据:', data)
  auth.uid = data.uid || ''
  auth.ticket = data.ticket || ''
}

onMounted(() => {
  console.log('子应用挂载完成',window.microApp)
  if (window.microApp) {
    // 1. 获取初始值
    const initialData = window.microApp.getGlobalData()
    handleGlobalData(initialData)
    
    // 2. 绑定监听
    window.microApp.addGlobalDataListener(handleGlobalData)
  }
})

onUnmounted(() => {
  if (window.microApp) {
    window.microApp.removeGlobalDataListener(handleGlobalData)
  }
})
</script>

<style>
.sub-app-layout { display: flex; font-family: sans-serif; }
.sub-sidebar { width: 200px; background: #34495e; color: white; height: 100vh; padding: 20px; }
.sub-sidebar a { display: block; padding: 10px; color: #bdc3c7; text-decoration: none; }
.sub-sidebar .router-link-active { background: #409EFF; color: white; border-radius: 4px; }
.sub-content { flex: 1; padding: 20px; background: white; border-radius: 4px; }
</style>