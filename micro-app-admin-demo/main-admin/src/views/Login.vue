<template>
  <div class="login-container">
    <div class="login-box">
      <h2>系统登录</h2>
      <div class="form-item">
        <input v-model="form.username" type="text" placeholder="用户名 (任意)" />
      </div>
      <div class="form-item">
        <input v-model="form.password" type="password" placeholder="密码 (任意)" />
      </div>
      <button @click="handleLogin" :disabled="loading" class="login-btn">
        {{ loading ? '登录中...' : '登 录' }}
      </button>
      <p class="tips">提示：点击登录即可模拟成功</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import microApp from '@micro-zoe/micro-app'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const form = reactive({
  username: 'admin',
  password: 'password'
})

const handleLogin = async () => {
  loading.value = true
  try {
    // 调用 NestJS 登录接口
    const response = await axios.post('http://localhost:3000/login', form)
    const { uid, ticket } = response.data
    
    // 1. 持久化
    localStorage.setItem('admin_uid', uid)
    localStorage.setItem('admin_ticket', ticket)
    
    // 2. 设置微前端全局数据
    microApp.setGlobalData({ uid, ticket })
    
    // 3. 跳转到首页
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请检查后端服务是否启动')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2d3a4b;
}
.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  text-align: center;
}
h2 { margin-bottom: 30px; color: #333; }
.form-item { margin-bottom: 20px; }
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
}
.login-btn {
  width: 100%;
  padding: 12px;
  background: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.login-btn:disabled { background: #a0cfff; }
.tips { margin-top: 20px; font-size: 12px; color: #999; }
</style>