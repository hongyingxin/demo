<template>
  <div>
    <input type="number" v-model="model" />
    <button @click="update">Increment</button>
  </div>
</template>

<script setup>
const model = defineModel('myValue')
</script>