<template>
  <div class="layout">
    <header class="header">
      <span class="brand">OpenSpec Demo</span>
      <nav class="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/todos">Todo</router-link>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  font-family: system-ui, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.brand {
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav a {
  color: #374151;
  text-decoration: none;
}

.nav a:hover {
  color: #111827;
}

.nav a.router-link-active {
  color: #2563eb;
  font-weight: 600;
}
</style>
