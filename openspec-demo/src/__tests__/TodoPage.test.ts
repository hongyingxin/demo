import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';

import TodoPage from '../views/TodoPage.vue';

describe('TodoPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows empty list hint on initial load', () => {
    const wrapper = mount(TodoPage);

    expect(wrapper.text()).toContain('暂无 Todo，添加一条吧');
  });

  it('renders a todo after adding', async () => {
    const wrapper = mount(TodoPage);

    await wrapper.find('input').setValue('写 OpenSpec');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.text()).toContain('写 OpenSpec');
    expect(wrapper.text()).not.toContain('暂无 Todo，添加一条吧');
  });
});
