<template>
  <div class="h-function-demo">
    <div class="container">
      <h2>h 函数练习</h2>
      <p class="description">使用 Vue 的 h 函数（render 函数）创建虚拟 DOM</p>

      <!-- 示例 1: 基础元素 -->
      <section class="demo-section">
        <h3>1. 基础元素创建</h3>
        <div class="demo-box">
          <component :is="basicElement" />
        </div>
        <div class="code-block">
          <pre>{{ basicElementCode }}</pre>
        </div>
      </section>

      <!-- 示例 2: 带属性和样式 -->
      <section class="demo-section">
        <h3>2. 元素属性和样式</h3>
        <div class="demo-box">
          <component :is="styledElement" />
        </div>
        <div class="code-block">
          <pre>{{ styledElementCode }}</pre>
        </div>
      </section>

      <!-- 示例 3: 嵌套元素 -->
      <section class="demo-section">
        <h3>3. 嵌套元素</h3>
        <div class="demo-box">
          <component :is="nestedElements" />
        </div>
        <div class="code-block">
          <pre>{{ nestedElementsCode }}</pre>
        </div>
      </section>

      <!-- 示例 4: 列表渲染 -->
      <section class="demo-section">
        <h3>4. 列表渲染</h3>
        <div class="demo-box">
          <component :is="listComponent" />
        </div>
        <div class="code-block">
          <pre>{{ listComponentCode }}</pre>
        </div>
      </section>

      <!-- 示例 5: 事件处理 -->
      <section class="demo-section">
        <h3>5. 事件处理</h3>
        <div class="demo-box">
          <component :is="eventComponent" />
        </div>
        <div class="code-block">
          <pre>{{ eventComponentCode }}</pre>
        </div>
      </section>

      <!-- 示例 6: 条件渲染 -->
      <section class="demo-section">
        <h3>6. 条件渲染</h3>
        <div class="demo-box">
          <component :is="conditionalComponent" />
        </div>
        <div class="code-block">
          <pre>{{ conditionalComponentCode }}</pre>
        </div>
      </section>

      <!-- 示例 7: 组合复杂组件 -->
      <section class="demo-section">
        <h3>7. 复杂组件（卡片列表）</h3>
        <div class="demo-box">
          <component :is="cardListComponent" />
        </div>
        <div class="code-block">
          <pre>{{ cardListComponentCode }}</pre>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { h, ref } from 'vue'

// ==================== 示例 1: 基础元素 ====================
const basicElement = () => {
  return h('div', '这是用 h 函数创建的基础 div 元素')
}

const basicElementCode = `const basicElement = () => {
  return h('div', '这是用 h 函数创建的基础 div 元素')
}`

// ==================== 示例 2: 带属性和样式 ====================
const styledElement = () => {
  return h(
    'div',
    {
      class: 'styled-box',
      style: {
        backgroundColor: '#42b983',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
      }
    },
    '这是带样式的元素'
  )
}

const styledElementCode = `const styledElement = () => {
  return h(
    'div',
    {
      class: 'styled-box',
      style: {
        backgroundColor: '#42b983',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
      }
    },
    '这是带样式的元素'
  )
}`

// ==================== 示例 3: 嵌套元素 ====================
const nestedElements = () => {
  return h('div', { class: 'nested-container' }, [
    h('h4', '嵌套标题'),
    h('p', '这是第一段文字'),
    h('p', { style: { color: '#42b983', fontWeight: 'bold' } }, '这是带样式的第二段'),
    h('div', { class: 'inner-box' }, [
      h('span', '内层元素1 '),
      h('span', { style: { color: 'red' } }, '内层元素2')
    ])
  ])
}

const nestedElementsCode = `const nestedElements = () => {
  return h('div', { class: 'nested-container' }, [
    h('h4', '嵌套标题'),
    h('p', '这是第一段文字'),
    h('p', { style: { color: '#42b983' } }, '带样式的段落'),
    h('div', { class: 'inner-box' }, [
      h('span', '内层元素1 '),
      h('span', { style: { color: 'red' } }, '内层元素2')
    ])
  ])
}`

// ==================== 示例 4: 列表渲染 ====================
const listComponent = () => {
  const items = ['Vue 3', 'React', 'Angular', 'Svelte']
  
  return h('ul', { class: 'list-demo' }, 
    items.map((item, index) => 
      h('li', { key: index, style: { marginBottom: '8px' } }, [
        h('span', { style: { fontWeight: 'bold', color: '#42b983' } }, `${index + 1}. `),
        h('span', item)
      ])
    )
  )
}

const listComponentCode = `const listComponent = () => {
  const items = ['Vue 3', 'React', 'Angular', 'Svelte']
  
  return h('ul', { class: 'list-demo' }, 
    items.map((item, index) => 
      h('li', { key: index }, [
        h('span', { style: { fontWeight: 'bold' } }, \`\${index + 1}. \`),
        h('span', item)
      ])
    )
  )
}`

// ==================== 示例 5: 事件处理 ====================
const counter = ref(0)

const eventComponent = () => {
  return h('div', { class: 'event-demo' }, [
    h('p', { style: { fontSize: '20px', marginBottom: '10px' } }, 
      `当前计数: ${counter.value}`
    ),
    h('button', {
      onClick: () => counter.value++,
      style: {
        backgroundColor: '#42b983',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px'
      }
    }, '增加'),
    h('button', {
      onClick: () => counter.value--,
      style: {
        backgroundColor: '#f56c6c',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px'
      }
    }, '减少'),
    h('button', {
      onClick: () => counter.value = 0,
      style: {
        backgroundColor: '#909399',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer'
      }
    }, '重置')
  ])
}

const eventComponentCode = `const counter = ref(0)

const eventComponent = () => {
  return h('div', { class: 'event-demo' }, [
    h('p', \`当前计数: \${counter.value}\`),
    h('button', {
      onClick: () => counter.value++
    }, '增加'),
    h('button', {
      onClick: () => counter.value--
    }, '减少'),
    h('button', {
      onClick: () => counter.value = 0
    }, '重置')
  ])
}`

// ==================== 示例 6: 条件渲染 ====================
const showMessage = ref(true)

const conditionalComponent = () => {
  return h('div', { class: 'conditional-demo' }, [
    h('button', {
      onClick: () => showMessage.value = !showMessage.value,
      style: {
        backgroundColor: '#409eff',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '15px'
      }
    }, showMessage.value ? '隐藏消息' : '显示消息'),
    showMessage.value 
      ? h('div', {
          style: {
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            padding: '15px',
            borderRadius: '5px',
            color: '#0050b3'
          }
        }, '这是一条可以切换显示的消息！')
      : null
  ])
}

const conditionalComponentCode = `const showMessage = ref(true)

const conditionalComponent = () => {
  return h('div', [
    h('button', {
      onClick: () => showMessage.value = !showMessage.value
    }, showMessage.value ? '隐藏消息' : '显示消息'),
    showMessage.value 
      ? h('div', { style: { ... } }, '这是可切换的消息')
      : null
  ])
}`

// ==================== 示例 7: 复杂组件 ====================
const cards = [
  { id: 1, title: 'Vue 3', desc: '渐进式 JavaScript 框架', color: '#42b983' },
  { id: 2, title: 'Composition API', desc: '更好的逻辑复用方案', color: '#409eff' },
  { id: 3, title: 'h 函数', desc: '灵活的渲染函数方式', color: '#e6a23c' }
]

const cardListComponent = () => {
  return h('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px'
    }
  }, cards.map(card => 
    h('div', {
      key: card.id,
      style: {
        border: `2px solid ${card.color}`,
        borderRadius: '8px',
        padding: '20px',
        transition: 'transform 0.3s',
        cursor: 'pointer'
      },
      onMouseenter: (e) => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
      },
      onMouseleave: (e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }
    }, [
      h('h4', { 
        style: { 
          color: card.color, 
          marginTop: 0, 
          marginBottom: '10px' 
        } 
      }, card.title),
      h('p', { 
        style: { 
          margin: 0, 
          color: '#666',
          fontSize: '14px' 
        } 
      }, card.desc)
    ])
  ))
}

const cardListComponentCode = `const cards = [
  { id: 1, title: 'Vue 3', desc: '渐进式框架', color: '#42b983' },
  { id: 2, title: 'Composition API', desc: '逻辑复用', color: '#409eff' },
  { id: 3, title: 'h 函数', desc: '渲染函数', color: '#e6a23c' }
]

const cardListComponent = () => {
  return h('div', {
    style: { display: 'grid', gap: '15px' }
  }, cards.map(card => 
    h('div', {
      style: { border: \`2px solid \${card.color}\` },
      onMouseenter: (e) => { /* hover effect */ }
    }, [
      h('h4', { style: { color: card.color } }, card.title),
      h('p', card.desc)
    ])
  ))
}`
</script>

<style scoped>
.h-function-demo {
  color: #2c3e50;
  padding: 30px 20px;
  background: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 32px;
}

.description {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
}

.demo-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.demo-section:last-child {
  border-bottom: none;
}

h3 {
  color: #42b983;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 22px;
}

.demo-box {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
}

.code-block {
  background: #2c3e50;
  color: #42b983;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  line-height: 1.6;
}

.code-block pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.nested-container {
  background: #f0f9ff;
  padding: 15px;
  border-radius: 5px;
}

.inner-box {
  background: white;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.list-demo {
  list-style: none;
  padding: 0;
  margin: 0;
}

.event-demo, .conditional-demo {
  text-align: center;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>

