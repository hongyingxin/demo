<template>
  <div class="sub-app-layout">
    <div v-if="!isMicroApp" class="sub-sidebar">
      <h3>独立运行模式菜单</h3>
      <router-link to="/">Dashboard</router-link>
      <router-link to="/users">Users</router-link>
      <router-link to="/orders">Orders</router-link>
    </div>
    <div class="sub-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
const isMicroApp = window.__MICRO_APP_ENVIRONMENT__
</script>

<style>
.sub-app-layout { display: flex; font-family: sans-serif; }
.sub-sidebar { width: 200px; background: #34495e; color: white; height: 100vh; padding: 20px; }
.sub-sidebar a { display: block; padding: 10px; color: #bdc3c7; text-decoration: none; }
.sub-sidebar .router-link-active { background: #409EFF; color: white; border-radius: 4px; }
.sub-content { flex: 1; padding: 20px; background: white; border-radius: 4px; }
</style>