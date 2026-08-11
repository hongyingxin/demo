import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter, RouterLink } from 'vue-router';
import { beforeEach, describe, expect, it } from 'vitest';

import App from '../App.vue';
import HomePage from '../views/HomePage.vue';
import TodoPage from '../views/TodoPage.vue';

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: HomePage },
      { path: '/todos', component: TodoPage },
    ],
  });
}

async function mountAppAt(path: string) {
  const router = createTestRouter();
  await router.push(path);
  await router.isReady();

  const wrapper = mount(App, {
    global: { plugins: [router] },
  });

  return { wrapper, router };
}

describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows Home page at /', async () => {
    const { wrapper } = await mountAppAt('/');

    expect(wrapper.text()).toContain('OpenSpec Demo');
    expect(wrapper.text()).toContain('规范驱动开发的 Todo 练习项目');
    expect(wrapper.text()).not.toContain('暂无 Todo，添加一条吧');
  });

  it('shows Todo page at /todos', async () => {
    const { wrapper } = await mountAppAt('/todos');

    expect(wrapper.text()).toContain('暂无 Todo，添加一条吧');
  });

  it('navigates to Todo via nav link', async () => {
    const { wrapper, router } = await mountAppAt('/');

    const todoNavLink = wrapper
      .findAllComponents(RouterLink)
      .find((link) => link.text() === 'Todo');
    await todoNavLink!.trigger('click');
    await flushPromises();
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/todos');
    expect(wrapper.text()).toContain('暂无 Todo，添加一条吧');
  });

  it('highlights active nav link on Todo page', async () => {
    const { wrapper } = await mountAppAt('/todos');

    const todoLink = wrapper.find('a[href="/todos"]');
    expect(todoLink.classes()).toContain('router-link-active');
  });
});
