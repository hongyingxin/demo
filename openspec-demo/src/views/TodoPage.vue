<script setup lang="ts">
import TodoForm from '../components/TodoForm.vue';
import TodoList from '../components/TodoList.vue';
import { useTodos } from '../composables/useTodos';

const { todos, addTodo, toggleTodo, removeTodo } = useTodos();
</script>

<template>
  <main class="todo-page">
    <h1>Todo</h1>
    <TodoForm @add="addTodo" />
    <TodoList
      :todos="todos"
      @toggle="toggleTodo"
      @remove="removeTodo"
    />
  </main>
</template>

<style scoped>
.todo-page {
  max-width: 480px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;
}
</style>
