<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  add: [text: string];
}>();

const text = ref('');

function submit(): void {
  const trimmed = text.value.trim();
  if (!trimmed) {
    return;
  }

  emit('add', text.value);
  text.value = '';
}
</script>

<template>
  <form class="todo-form" @submit.prevent="submit">
    <input
      v-model="text"
      type="text"
      placeholder="添加 Todo..."
      aria-label="Todo 内容"
    />
    <button type="submit">添加</button>
  </form>
</template>

<style scoped>
.todo-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.todo-form input {
  flex: 1;
  padding: 0.5rem;
}

.todo-form button {
  padding: 0.5rem 1rem;
}
</style>
