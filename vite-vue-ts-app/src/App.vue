<script setup lang="ts">
import { onMounted } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'
import { debounce } from 'lodash-es'

console.log('🚀 [App] 组件加载');

const testDebounce = debounce(() => {
  console.log('Debounced function called');
}, 500);

onMounted(async () => {
  testDebounce();
  try {
    const res = await axios.get('https://api.github.com/zen');
    console.log('Github Zen:', res.data);
  } catch (e) {
    console.error('Axios error:', e);
  }
});
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
</template>

<style scoped>
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
