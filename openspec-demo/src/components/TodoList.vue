<script setup lang="ts">
import type { Todo } from '../composables/useTodos';

import TodoItem from './TodoItem.vue';

defineProps<{
  todos: Todo[];
}>();

defineEmits<{
  toggle: [id: string];
  remove: [id: string];
}>();
</script>

<template>
  <div>
    <p v-if="todos.length === 0" class="empty-hint">暂无 Todo，添加一条吧</p>
    <ul v-else class="todo-list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="$emit('toggle', $event)"
        @remove="$emit('remove', $event)"
      />
    </ul>
  </div>
</template>

<style scoped>
.empty-hint {
  color: #666;
  font-style: italic;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
