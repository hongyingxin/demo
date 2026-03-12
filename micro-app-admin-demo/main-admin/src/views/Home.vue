<template>
  <div class="home-view">
    <h1>🏛️ 基座首页</h1>
    <p>这里是主应用自有的页面内容。</p>
    <div class="stats">
      <div class="card">系统状态：在线</div>
      <div class="card">用户数：12,345</div>
      <div class="card">子应用：sub-admin (已就绪)</div>
    </div>
  </div>
</template>

<style scoped>
.stats { display: flex; gap: 20px; margin-top: 20px; }
.card { background: white; padding: 20px; border-radius: 8px; flex: 1; text-align: center; border: 1px solid #dcdfe6; }
</style>