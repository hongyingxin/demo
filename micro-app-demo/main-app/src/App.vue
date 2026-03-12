<template>
  <div id="app-container" style="max-width: 1200px; margin: 0 auto; font-family: sans-serif;">
    <header style="padding: 1rem; background: #2c3e50; color: white; display: flex; justify-content: space-between; align-items: center;">
      <h2 style="margin: 0;" class="common-title">主应用管理后台</h2>
      <nav>
        <router-link to="/" style="color: white; margin-right: 20px; text-decoration: none;">首页 (主应用)</router-link>
        <router-link to="/sub-app/" style="color: white; text-decoration: none;">微应用 (子应用)</router-link>
      </nav>
    </header>

    <main style="padding: 2rem;">
      <div class="common-title" style="margin-bottom: 10px;">这是主应用的公共样式测试</div>
      <p style="color: #666;">主应用当前路径: <strong style="color: #e74c3c;">{{ $route.path }}</strong></p>
      
      <!-- 路由出口 -->
      <router-view></router-view>
    </main>

    <footer style="margin-top: 2rem; padding: 1rem; border-top: 1px solid #eee; text-align: center; color: #999;">
      &copy; 2026 Micro-App Demo - 演示主子应用路由分离
    </footer>
  </div>
</template>

<style>
.router-link-active {
  font-weight: bold;
  border-bottom: 2px solid white;
}

/* 主应用定义的公共类名 */
.common-title {
  background-color: #3498db !important; /* 蓝色 */
  color: white !important;
  padding: 10px;
  border-radius: 4px;
}
</style>