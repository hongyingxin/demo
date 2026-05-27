<template>
  <!-- 如果是登录页，不显示侧边栏和顶栏 -->
  <div v-if="$route.name === 'login'">
    <router-view></router-view>
  </div>

  <div v-else class="admin-layout">
    <aside class="sidebar">
      <div class="logo">管理后台 (基座)</div>
      
      <!-- 系统切换器 (顶层菜单) -->
      <div class="system-switcher">
        <div 
          v-for="sys in systems" 
          :key="sys.id"
          :class="['sys-item', activeSystem === sys.id ? 'active' : '']"
          @click="switchSystem(sys)"
        >
          {{ sys.name }}
        </div>
      </div>

      <!-- 动态渲染侧边栏菜单 -->
      <nav>
        <div class="menu-group">{{ currentSystemName }} - 菜单</div>
        <router-link 
          v-for="menu in currentMenus" 
          :key="menu.path" 
          :to="menu.path"
        >
          {{ menu.icon }} {{ menu.title }}
        </router-link>
      </nav>
    </aside>
    <section class="main-content">
      <header class="navbar">
        <span>当前位置：{{ $route.path }}</span>
        <div class="user-info">
          <span style="margin-right: 10px; color: #27ae60;">🟢 {{ auth.uid }}</span>
          <button @click="logout" class="login-btn logout">退出登录</button>
        </div>
      </header>
      <div class="view-body">
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import microApp from '@micro-zoe/micro-app'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const auth = reactive({
  uid: '',
  ticket: ''
})

// 菜单数据状态
const systems = ref([])
const allMenus = ref({})
const activeSystem = ref('')

const currentSystemName = computed(() => {
  return systems.value.find(s => s.id === activeSystem.value)?.name || '加载中'
})

const currentMenus = computed(() => {
  return allMenus.value[activeSystem.value] || []
})

const switchSystem = (sys) => {
  activeSystem.value = sys.id
  if (currentMenus.value.length > 0) {
    router.push(currentMenus.value[0].path)
  }
}

// 从后端获取菜单
const fetchMenus = async () => {
  try {
    const response = await axios.get('http://localhost:3000/menus')
    const data = response.data
    
    // 转换后端数据格式
    systems.value = data.map(sys => ({
      id: sys.id,
      name: sys.name,
      icon: sys.icon
    }))
    
    const menusMap = {}
    data.forEach(sys => {
      menusMap[sys.id] = sys.menus
    })
    allMenus.value = menusMap
    
    // 默认激活第一个系统
    if (systems.value.length > 0 && !activeSystem.value) {
      activeSystem.value = systems.value[0].id
    }
  } catch (error) {
    console.error('获取菜单失败:', error)
  }
}

// 监听路由变化：处理登录成功后的状态同步和菜单拉取
watch(
  () => route.path,
  (newPath) => {
    if (newPath !== '/login' && !auth.uid) {
      const savedUid = localStorage.getItem('admin_uid')
      const savedTicket = localStorage.getItem('admin_ticket')
      
      if (savedUid && savedTicket) {
        auth.uid = savedUid
        auth.ticket = savedTicket
        
        // 同步给微前端
        microApp.setGlobalData({ uid: auth.uid, ticket: auth.ticket })
        
        // 如果菜单还没加载，则加载菜单
        if (systems.value.length === 0) {
          fetchMenus()
        }
      }
    }
  },
  { immediate: true }
)

// 初始化时从 localStorage 加载
onMounted(() => {
  const savedUid = localStorage.getItem('admin_uid')
  const savedTicket = localStorage.getItem('admin_ticket')
  
  if (savedUid && savedTicket) {
    auth.uid = savedUid
    auth.ticket = savedTicket
    
    // 同步给微前端全局数据
    microApp.setGlobalData({
      uid: auth.uid,
      ticket: auth.ticket
    })
    
    // 获取菜单
    fetchMenus()
  }
})

const logout = () => {
  auth.uid = ''
  auth.ticket = ''
  
  // 从 localStorage 移除
  localStorage.removeItem('admin_uid')
  localStorage.removeItem('admin_ticket')
  
  // 清除全局数据
  microApp.setGlobalData({
    uid: null,
    ticket: null
  })

  // 跳转到登录页
  router.push('/login')
}
</script>

<style>
/* 系统切换器样式 */
.system-switcher {
  display: flex;
  background: #1f2d3d;
  padding: 5px;
  gap: 5px;
}
.sys-item {
  flex: 1;
  font-size: 12px;
  text-align: center;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 4px;
  color: #909399;
  transition: 0.3s;
}
.sys-item.active {
  background: #409EFF;
  color: white;
}
.sys-item:hover:not(.active) {
  background: #263445;
}

/* ... 现有样式 ... */
.login-btn {
  padding: 6px 15px;
  background: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.login-btn.logout { background: #f56c6c; }
/* ... 现有样式 ... */
body { margin: 0; font-family: sans-serif; }
.admin-layout { display: flex; height: 100vh; }
.sidebar { width: 240px; background: #2c3e50; color: white; display: flex; flex-direction: column; }
.logo { padding: 20px; font-size: 20px; font-weight: bold; border-bottom: 1px solid #34495e; }
.sidebar nav { flex: 1; padding: 10px 0; }
.sidebar a { display: block; padding: 12px 20px; color: #bdc3c7; text-decoration: none; transition: 0.3s; }
.sidebar a:hover { background: #34495e; color: white; }
.sidebar .router-link-active { background: #409EFF; color: white; }
.menu-group { padding: 20px 20px 10px; font-size: 12px; color: #7f8c8d; text-transform: uppercase; }

.main-content { flex: 1; display: flex; flex-direction: column; background: #f5f7f9; }
.navbar { height: 60px; background: white; border-bottom: 1px solid #dcdfe6; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
.view-body { flex: 1; padding: 20px; overflow-y: auto; }
</style>