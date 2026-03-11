import type { Plugin } from 'vite';

export function vitePluginDemo(): Plugin {
  // 全局配置
  let config
  console.log(config)
  return {
    name: 'vite-plugin-demo',
    // 在解析vite配置前调用，接收原始用户配置
    config(userConfig, { mode, command }) {
      console.log('🚀 [Demo] 用户配置:', userConfig);
      console.log(`🚀 [Demo] 当前运行模式: ${mode}`);
      console.log(`🚀 [Demo] 当前命令: ${command}`);
      return {
      };
    },
    // 解析vite配置后调用，接收解析后的配置
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      console.log('🚀 [Demo] 解析后的配置:', resolvedConfig);
    },
    // 配置开发服务器 生产版本不会被调用
    configureServer(server) {
      console.log('🚀 [Demo] 配置服务器:', server);
    },
    // 与configureServer类似，但用于预览服务器
    configurePreviewServer(previewServer) {
      console.log('🚀 [Demo] 配置预览服务器:', previewServer);
    },
    // 转换 index.html 的钩子
    transformIndexHtml(html) {
      console.log('🚀 [Demo] 转换 index.html:', html);
      return html.replace('<head>', '<head>\n    <!-- 由 vite-plugin-demo 注入的注释 -->');
    },
    // 执行自定义HMR更新处理
    handleHotUpdate(ctx) {
      console.log('🚀 [Demo] 处理热更新:', ctx);
    }
  }
}