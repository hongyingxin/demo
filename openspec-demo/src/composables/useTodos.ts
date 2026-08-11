import { ref, watch } from 'vue';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const STORAGE_KEY = 'openspec-demo:todos';

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Todo[]) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // localStorage 不可用时降级为仅内存存储
  }
}

export function useTodos() {
  const todos = ref<Todo[]>(loadTodos());

  watch(
    todos,
    (value) => {
      saveTodos(value);
    },
    { deep: true, flush: 'sync' },
  );

  function addTodo(text: string): boolean {
    const trimmed = text.trim();
    if (!trimmed) {
      return false;
    }

    todos.value.push({
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
    });
    return true;
  }

  function toggleTodo(id: string): void {
    const todo = todos.value.find((item) => item.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  function removeTodo(id: string): void {
    todos.value = todos.value.filter((item) => item.id !== id);
  }

  return { todos, addTodo, toggleTodo, removeTodo };
}
