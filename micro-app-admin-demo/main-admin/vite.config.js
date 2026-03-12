import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
export default defineConfig({ 
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('micro-app')
        }
      }
    })
  ], 
  server: { 
    port: 4000,
    cors: true,
    headers: { "Access-Control-Allow-Origin": "*" }
  } 
})
