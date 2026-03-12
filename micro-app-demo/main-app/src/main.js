import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import microApp from "@micro-zoe/micro-app"

// 1. 定义主应用的全局公共工具 (模拟共享依赖/通用库)
window.commonUtils = {
  sayHello: (name) => `Hello ${name}, this is from Main App Global Utils!`,
  currentTime: () => new Date().toLocaleTimeString(),
  version: '1.0.0'
}

// 2. 启动 micro-app
microApp.start({
  // 可以配置全局资源，子应用可以直接访问
  globalAssets: {
    js: [],
    css: []
  }
})

createApp(App).use(router).mount("#app")
