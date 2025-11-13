<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav style="background: #42b983; padding: 15px 30px; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
        <h1 style="margin: 0; font-size: 24px;">Vue 3 示例项目</h1>
        <div style="display: flex; gap: 20px;">
          <router-link 
            to="/" 
            style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s;"
            active-class="active-link"
          >
            首页
          </router-link>
          <router-link 
            to="/v-model-demo" 
            style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s;"
            active-class="active-link"
          >
            V-Model 演示
          </router-link>
        </div>
      </div>
    </nav>
    
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup>
// App 作为路由容器
</script>

<style>
#app {
  min-height: 100vh;
}

.active-link {
  opacity: 0.7;
  text-decoration: underline !important;
}

a:hover {
  opacity: 0.8;
}
</style>
