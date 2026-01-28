import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { myLearningPlugin } from './src/plugins/my-learning-plugin'
// import { vitePluginPractical } from './src/plugins/vite-plugin-practical'
// import { vitePluginDemo } from './src/plugins/vite-plugin-demo'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // myLearningPlugin(),
    // vitePluginPractical()
    // vitePluginDemo()
  ],
})
