import { describe, expect, it, beforeEach } from 'vitest';

import { STORAGE_KEY, useTodos } from '../composables/useTodos';

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a todo with trimmed text', () => {
    const { todos, addTodo } = useTodos();

    expect(addTodo('  买牛奶  ')).toBe(true);
    expect(todos.value).toHaveLength(1);
    expect(todos.value[0]?.text).toBe('买牛奶');
    expect(todos.value[0]?.completed).toBe(false);
  });

  it('rejects empty content', () => {
    const { todos, addTodo } = useTodos();

    expect(addTodo('')).toBe(false);
    expect(addTodo('   ')).toBe(false);
    expect(todos.value).toHaveLength(0);
  });

  it('toggles completion state', () => {
    const { todos, addTodo, toggleTodo } = useTodos();

    addTodo('写测试');
    const id = todos.value[0]?.id;
    expect(id).toBeDefined();

    toggleTodo(id!);
    expect(todos.value[0]?.completed).toBe(true);

    toggleTodo(id!);
    expect(todos.value[0]?.completed).toBe(false);
  });

  it('removes a todo', () => {
    const { todos, addTodo, removeTodo } = useTodos();

    addTodo('第一条');
    addTodo('第二条');
    const firstId = todos.value[0]?.id;
    expect(firstId).toBeDefined();

    removeTodo(firstId!);
    expect(todos.value).toHaveLength(1);
    expect(todos.value[0]?.text).toBe('第二条');
  });

  it('persists todos to localStorage', () => {
    const first = useTodos();
    first.addTodo('持久化测试');
    first.toggleTodo(first.todos.value[0]!.id);

    const second = useTodos();
    expect(second.todos.value).toHaveLength(1);
    expect(second.todos.value[0]?.text).toBe('持久化测试');
    expect(second.todos.value[0]?.completed).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toContain('持久化测试');
  });
});
