<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <input type="number" v-model="model" />
  <button @click="update">Increment</button>
</template>

<script setup>
const model = defineModel('myValue')

const update = () => {
  console.log('Before update:', model.value)
  model.value = Number(model.value) + 1
  console.log('After update:', model.value)
}
</script>