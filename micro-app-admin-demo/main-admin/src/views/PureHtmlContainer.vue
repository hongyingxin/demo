<template>
  <div class="sub-app-wrapper">
    <div v-if="loading" class="loading-overlay">⏳ 纯 HTML 应用加载中...</div>
    <micro-app 
      name="pure-html-app" 
      url="http://localhost:4002/" 
      iframe
      baseroute="/pure-html"
      :data="{ msg: '来自主应用的问候 (给纯 HTML)' }"
      @mounted="loading = false"
      @datachange="handleDataChange"
    ></micro-app>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(true)

const handleDataChange = (e) => {
  const data = e.detail.data
  if (data.type === 'UNAUTHORIZED') {
    console.warn('[主应用] 检测到纯 HTML 应用 401，执行全局登出')
    localStorage.removeItem('admin_uid')
    localStorage.removeItem('admin_ticket')
    import('@micro-zoe/micro-app').then(microApp => {
      microApp.default.setGlobalData({ uid: null, ticket: null })
    })
    alert('会话已过期，请重新登录')
    window.location.reload()
  } else if (data.reply) {
    alert('收到纯 HTML 应用的回传：' + data.reply)
  }
}
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