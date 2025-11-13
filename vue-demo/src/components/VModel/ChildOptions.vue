<template>
  <div class="space-y-4">
    <div class="bg-white rounded-lg p-4 shadow-sm border border-green-200">
      <span class="text-gray-600">当前值：</span>
      <span class="text-2xl font-bold text-green-600 ml-2">{{ modelValue }}</span>
    </div>
    
    <div class="flex gap-2">
      <button 
        @click="increment" 
        class="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-600 transform transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
        </svg>
        增加
      </button>
      <button 
        @click="decrement" 
        class="flex-1 bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-orange-600 transform transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
        </svg>
        减少
      </button>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        使用 computed 的双向绑定：
      </label>
      <input 
        type="number" 
        v-model="localValue"
        class="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
        placeholder="输入数值"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChildOptions',
  props: {
    modelValue: {
      type: Number,
      required: true
    }
  },
  emits: ['update:modelValue'],
  computed: {
    // 使用 computed 属性实现双向绑定
    localValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', Number(value))
      }
    }
  },
  methods: {
    increment() {
      this.$emit('update:modelValue', this.modelValue + 1)
    },
    decrement() {
      this.$emit('update:modelValue', this.modelValue - 1)
    }
  }
}
</script>

