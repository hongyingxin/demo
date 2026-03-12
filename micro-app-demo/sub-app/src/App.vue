<template>
  <div style="padding: 10px; border: 3px solid #66f; color: #333;">
    <h2 class="common-title">这是子应用 (Sub App)</h2>
    <p>我是嵌入在主应用中的 Vue 3 应用。</p>

    <div style="margin: 10px 0;">
      <router-link to="/">首页</router-link> | 
      <router-link to="/about">关于</router-link>
    </div>
    
    <router-view style="border: 1px dashed #666; padding: 10px; margin-top: 10px;"></router-view>
    
    <div style="background-color: #eee; padding: 10px; margin: 10px 0;">
      <p class="common-title">子应用的公共样式测试内容</p>
      <p>收到主应用的数据：<strong style="color: green;">{{ mainMsg }}</strong></p>
      <button @click="sendToMain">回传消息给主应用</button>
    </div>

    <div style="background-color: #fff4e6; padding: 10px; margin: 10px 0; border: 1px solid #e67e22;">
      <p>🚀 <strong>使用主应用共享的工具：</strong></p>
      <button @click="useMainUtil">调用主应用全局方法</button>
      <p v-if="utilResult">方法返回：<span style="color: #d35400;">{{ utilResult }}</span></p>
    </div>

    <button @click="count++">Count is: {{ count }}</button>
  </div>
</template>

<style>
/* 子应用定义的公共类名，与主应用冲突 */
.common-title {
  background-color: #e67e22 !important; /* 橙色 */
  color: black !important;
  padding: 5px;
  border: 2px dashed #000;
  border-radius: 10px;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"

const count = ref(0)
const mainMsg = ref("暂无")
const utilResult = ref("")

const useMainUtil = () => {
  // 1. 获取主应用传来的 data
  const data = window.microApp?.getData()
  if (data && data.utils) {
    // 2. 在 iframe 模式下，主应用的 window 可以通过 window.parent 访问
    // 或者直接访问注入到沙箱的 window 对象（micro-app 会处理代理）
    const mainUtils = window.parent[data.utils] || window[data.utils]
    if (mainUtils && mainUtils.sayHello) {
      utilResult.value = mainUtils.sayHello('Sub App')
      console.log('当前主应用版本:', mainUtils.version)
    } else {
      utilResult.value = "未找到共享方法"
    }
  } else {
    utilResult.value = "未收到工具包引用"
  }
}

// 定义数据监听回调
const handleDataChange = (data) => {
  console.log("子应用收到主应用数据:", data)
  if (data.msg) {
    mainMsg.value = data.msg
  }
}

const sendToMain = () => {
  // 使用 window.microApp.dispatch 向主应用发送数据
  if (window.microApp) {
    window.microApp.dispatch({ reply: `Sub App replied at ${new Date().toLocaleTimeString()}` })
  }
}

onMounted(() => {
  console.log('子应用 Vue 实例: onMounted')
  // 绑定监听
  if (window.microApp) {
    // 监听主应用下发的数据
    window.microApp.addDataListener(handleDataChange, true) // 第二个参数为 true 表示立即执行一次
  }
})

onUnmounted(() => {
  console.log('子应用 Vue 实例: onUnmounted')
  // 解绑监听
  if (window.microApp) {
    window.microApp.removeDataListener(handleDataChange)
  }
})
</script>
