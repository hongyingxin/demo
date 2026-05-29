<template>
  <div class="login-container">
    <el-card class="login-box">
      <template #header>
        <h2 class="login-title">系统登录</h2>
      </template>
      <el-form :model="form" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="tips">提示：点击登录即可模拟成功</div>
    </el-card>
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
    const response = await axios.post('http://localhost:3000/login', form)
    const { uid, ticket } = response.data
    localStorage.setItem('admin_uid', uid)
    localStorage.setItem('admin_ticket', ticket)
    microApp.setGlobalData({ uid, ticket })
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
  width: 450px;
}
.login-title {
  margin: 0;
  text-align: center;
  font-size: 24px;
  color: #333;
}
.login-btn {
  width: 100%;
  margin-top: 10px;
}
.tips {
  margin-top: 15px;
  font-size: 13px;
  color: #999;
  text-align: center;
}
</style>