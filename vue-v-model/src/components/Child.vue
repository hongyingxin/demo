<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>

<script setup>
const model = defineModel()

const update = () => {
  console.log('Before update:', model.value)
  model.value++
  console.log('After update:', model.value)
}
</script>