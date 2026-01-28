import type { Plugin } from 'vite';

export function myLearningPlugin(): Plugin {
  return {
    // 插件名称，用于调试
    name: 'vite-plugin-my-learning',

    // 1. 在解析 Vite 配置后调用
    configResolved(resolvedConfig) {
      console.log('✅ [MyPlugin] Vite 配置已解析完成');
      console.log('当前根目录:', resolvedConfig.root);
    },

    // 2. 转换 index.html 的钩子
    transformIndexHtml(html) {
      console.log('✅ [MyPlugin] 正在处理 index.html');
      return html.replace(
        '<head>',
        `<head>\n    <!-- 由 my-learning-plugin 注入的注释 -->`
      );
    },

    // 3. 转换代码文件的钩子
    // code 是文件源码，id 是文件路径
    transform(code, id) {
      // 我们只处理 .vue 文件
      if (id.endsWith('.vue')) {
        console.log(`✅ [MyPlugin] 正在处理 Vue 文件: ${id}`);
        
        // 在 script 块中注入一行 log (这是一个非常简单的示例)
        // 注意：在生产环境插件中，通常会使用 magic-string 来处理以保持 sourcemap
        return {
          code: code.replace('<script setup>', '<script setup>\n  console.log("Hello from My Learning Plugin in " + import.meta.url);'),
          map: null // 简单起见，不提供 sourcemap
        };
      }
    }
  };
}

