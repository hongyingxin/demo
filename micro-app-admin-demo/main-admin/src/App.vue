<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo">管理后台 (基座)</div>
      <nav>
        <router-link to="/">🏠 首页</router-link>
        <div class="menu-group">子系统模块</div>
        <router-link to="/sub-system/">📊 子系统仪表盘</router-link>
        <router-link to="/sub-system/users">👥 用户管理 (子应用)</router-link>
        <router-link to="/sub-system/orders">📦 订单管理 (子应用)</router-link>
      </nav>
    </aside>
    <section class="main-content">
      <header class="navbar">
        <span>当前位置：{{ $route.path }}</span>
        <div class="user-info">Admin 用户</div>
      </header>
      <div class="view-body">
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<style>
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