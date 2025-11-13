<template>
  <div class="space-y-4">
    <div class="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
      <span class="text-gray-600">当前值：</span>
      <span class="text-2xl font-bold text-blue-600 ml-2">{{ modelValue }}</span>
    </div>
    
    <div class="flex gap-2">
      <button 
        @click="increment" 
        class="flex-1 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transform transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        增加
      </button>
      <button 
        @click="decrement" 
        class="flex-1 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-600 transform transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
        </svg>
        减少
      </button>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">直接输入：</label>
      <input 
        type="number" 
        :value="modelValue" 
        @input="handleInput"
        class="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义 props
const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  }
})

// 定义 emits
const emit = defineEmits(['update:modelValue'])

// 增加值
const increment = () => {
  emit('update:modelValue', props.modelValue + 1)
}

// 减少值
const decrement = () => {
  emit('update:modelValue', props.modelValue - 1)
}

// 处理输入
const handleInput = (event) => {
  const value = Number(event.target.value)
  if (!isNaN(value)) {
    emit('update:modelValue', value)
  }
}
</script>

