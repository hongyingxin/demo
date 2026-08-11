<template>
  <main class="home-page">
    <h1>OpenSpec Demo</h1>
    <p>规范驱动开发的 Todo 练习项目。</p>
    <router-link class="enter-link" to="/todos">进入 Todo →</router-link>
  </main>
</template>

<style scoped>
.home-page {
  max-width: 480px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;
}

.enter-link {
  display: inline-block;
  margin-top: 1rem;
  color: #2563eb;
  text-decoration: none;
}

.enter-link:hover {
  text-decoration: underline;
}
</style>
