<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <y-button type="primary">按钮</y-button>
  <div class="box">
    <y-scroll-text     
    :duration="15"
    direction="left"
    :pause-on-hover="true"
    :delay="1"
    :gap="50">
      <span>这是一段滚动文本</span>
    </y-scroll-text>
  </div>

</template>
<script setup lang="ts">
</script>
<style scoped>

.box {
  width: 100px;
  background-color: azure;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
