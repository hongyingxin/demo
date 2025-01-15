import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import * as Sentry from '@sentry/vue'

const app = createApp(App)

Sentry.init({
  // Vue 应用实例，以便 Sentry 可以与应用进行集成
  app,
  // 客户端密钥，可以通过进入项目 -》右上角设置 -》客户端密钥(DSN) 里面拷贝
  dsn: "https://88ca76f4e768c60384223ef3803cc366@sentry.vchat-onlie.com:443/29",
  // 配置sentry的集成插件
  integrations: [
    // 用于浏览器端的性能监控
    Sentry.browserTracingIntegration(),
    //  用于会话重放功能
    Sentry.replayIntegration(),
  ],
  // 性能监控的采样率
  tracesSampleRate: 1.0, // 采样率为 1.0 表示采集 100% 的事务数据
  // 指定哪些 URL 应启用分布式追踪，可以是字符串或正则表达式
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // 会话重放的采样率
  replaysSessionSampleRate: 0.1, // 0.1 表示采集 10% 的会话
  // 在发生错误时会话重放的采样率
  replaysOnErrorSampleRate: 1.0, // 1.0 表示采集所有错误会话
  // 当前环境
  environment: 'production',
})

app.mount('#app')
