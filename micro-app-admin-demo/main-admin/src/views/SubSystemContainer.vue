<template>
  <div class="sub-app-wrapper">
    <div v-if="loading" class="loading-overlay">⏳ 子应用资源加载中...</div>
    <micro-app 
      name="sub-admin" 
      url="http://localhost:4001/" 
      iframe
      router-mode="native"
      baseroute="/sub-system"
      @mounted="loading = false"
      @error="loading = false"
    ></micro-app>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import microApp from '@micro-zoe/micro-app'

const loading = ref(true)
const route = useRoute()

// 当子应用挂载完成后，立即执行一次同步
const handleMounted = () => {
  loading.value = false
  syncRouteToSubApp(route.path)
}

const handleError = () => {
  loading.value = false
  console.error('子应用加载失败')
}

// 定义同步函数：将主应用路径映射到子应用路径并推送
const syncRouteToSubApp = (mainPath) => {
  if (mainPath.startsWith('/sub-system')) {
    // 映射逻辑：/sub-system/users -> /users
    const subPath = mainPath.replace('/sub-system', '') || '/'
    console.log('[主应用] 准备同步子应用路由至:', subPath)
    
    // microApp.router.push 的第一个参数是子应用的 name
    microApp.router.push({
      name: 'sub-admin',
      path: subPath
    })
  }
}

// 侦听主应用路由变化
watch(
  () => route.path,
  (newPath) => {
    // 只有在子应用已挂载的情况下才推送，避免初始化期间的竞态
    if (!loading.value) {
      syncRouteToSubApp(newPath)
    }
  }
)

// 处理直接刷新页面的情况
onMounted(() => {
  if (!loading.value) {
    syncRouteToSubApp(route.path)
  }
})
</script>

<style scoped>
.sub-app-wrapper {
  position: relative;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 20px;
}
.loading-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.8);
  z-index: 10;
}
</style>