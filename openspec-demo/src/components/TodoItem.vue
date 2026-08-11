<script setup lang="ts">
import type { Todo } from '../composables/useTodos';

defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  toggle: [id: string];
  remove: [id: string];
}>();
</script>

<template>
  <li class="todo-item" :class="{ completed: todo.completed }">
    <label>
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="emit('toggle', todo.id)"
      />
      <span class="todo-text">{{ todo.text }}</span>
    </label>
    <button type="button" @click="emit('remove', todo.id)">删除</button>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.todo-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
