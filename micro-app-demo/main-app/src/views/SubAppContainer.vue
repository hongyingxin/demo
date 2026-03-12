<template>
  <div style="padding: 20px; border: 5px solid #ccc;">
    <h2>🔧 这是子应用容器 (Sub App Container)</h2>
    <div style="margin-bottom: 20px; background: #fff; padding: 10px;">
      <p>主应用数据：<strong>{{ mainMessage }}</strong></p>
      <button @click="sendToSub">向子应用发送消息</button>
      <p v-if="fromSub">来自子应用的回传：<span style="color: blue;">{{ fromSub }}</span></p>
      <p>子应用状态：<span :style="{ color: subAppStatusColor }"><strong>{{ subAppStatus }}</strong></span></p>
    </div>
    
    <p v-if="subAppStatus === '加载中...'">正在加载子应用资源，请稍候...</p>
    <!-- baseroute 会自动拼接到子应用路由前面 -->
    <micro-app 
      name="sub-app" 
      url="http://localhost:3001/" 
      iframe
      baseroute="/sub-app"
      :data="{ ...subAppData, utils: 'commonUtils' }"
      @datachange="handleDataFromSub"
      @created="handleCreated"
      @beforemount="handleBeforeMount"
      @mounted="handleMounted"
      @unmount="handleUnmount"
      @error="handleError"
    ></micro-app>
  </div>
</template>

<script setup>
import { ref } from "vue"

const mainMessage = ref("Hello from Main!")
const subAppData = ref({ msg: mainMessage.value })
const fromSub = ref("")
const subAppStatus = ref("未启动")
const subAppStatusColor = ref("#666")

const sendToSub = () => {
  const newMsg = `Main updated at ${new Date().toLocaleTimeString()}`
  mainMessage.value = newMsg
  subAppData.value = { msg: newMsg }
}

const handleDataFromSub = (e) => {
  console.log("主应用容器收到子应用数据:", e.detail.data)
  fromSub.value = e.detail.data.reply
}

// 生命周期钩子
const handleCreated = () => {
  console.log('生命周期: 子应用已创建')
  subAppStatus.current = 'created'
  subAppStatus.value = '加载完毕 (Created)'
  subAppStatusColor.value = '#e67e22'
}

const handleBeforeMount = () => {
  console.log('生命周期: 子应用即将挂载')
  subAppStatus.value = '准备挂载 (BeforeMount)'
  subAppStatusColor.value = '#f1c40f'
}

const handleMounted = () => {
  console.log('生命周期: 子应用已挂载')
  subAppStatus.value = '运行中 (Mounted)'
  subAppStatusColor.value = '#27ae60'
}

const handleUnmount = () => {
  console.log('生命周期: 子应用已卸载')
  subAppStatus.value = '已卸载 (Unmount)'
  subAppStatusColor.value = '#95a5a6'
}

const handleError = () => {
  console.log('生命周期: 子应用加载异常')
  subAppStatus.value = '加载异常 (Error)'
  subAppStatusColor.value = '#e74c3c'
}
</script>