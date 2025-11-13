<template>
  <div style="padding: 40px; text-align: center;">
    <h1 style="margin-bottom: 30px;">Vue 3 示例项目</h1>
    
    <div style="max-width: 600px; margin: 0 auto;">
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 30px; margin-bottom: 20px; background: #f9f9f9;">
        <h2 style="margin-bottom: 15px;">📚 示例列表</h2>
        
        <div style="margin-top: 20px;">
          <router-link 
            to="/v-model-demo" 
            style="display: inline-block; padding: 12px 24px; background: #42b983; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; transition: all 0.3s;"
          >
            V-Model 演示
          </router-link>
        </div>
        
        <p style="margin-top: 15px; color: #666; font-size: 14px;">
          演示三种不同的 v-model 实现方式
        </p>
      </div>
      
      <div style="color: #666; font-size: 14px;">
        <p>更多示例即将推出...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 首页组件
</script>

<style scoped>
a:hover {
  background: #35a372 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>

