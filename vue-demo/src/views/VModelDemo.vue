<template>
  <div style="padding: 20px">
    <h2>Parent count value: {{ count }}</h2>
    
    <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd">
      <h3>使用 defineModel 的组件：</h3>
      <Child v-model="count" />
    </div>
    
    <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd">
      <h3>使用传统 props/emit 的组件（Composition API）：</h3>
      <ChildTraditional v-model="count" />
    </div>
    
    <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd">
      <h3>使用 Options API 的组件：</h3>
      <ChildOptions v-model="count" />
    </div>
    
    <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd">
      <h3>使用 defineModel 带参数名的组件：</h3>
      <ChildParam v-model:myValue="count" />
    </div>

    <div style="margin-top: 20px">
      <button @click="count = 0">Reset Count</button>
    </div>
  </div>
</template>

<script setup>
import Child from '../components/VModel/Child.vue'
import ChildTraditional from '../components/VModel/ChildTraditional.vue'
import ChildOptions from '../components/VModel/ChildOptions.vue'
import ChildParam from '../components/VModel/ChildParam.vue'
import { ref } from 'vue'

const count = ref(0)
</script>

