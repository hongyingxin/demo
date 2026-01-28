import type { Plugin } from 'vite';
import pkg from '../../package.json';

export function vitePluginPractical(): Plugin {
  let config: any;

  return {
    name: 'vite-plugin-practical',

    // 1. 修改/增加 Vite 配置
    config(userConfig, { mode }) {
      console.log('🚀 [Practical] 用户配置:', userConfig);
      console.log(`🚀 [Practical] 当前运行模式: ${mode}`);
      
      return {
        define: {
          // 注入全局常量，在代码中可以直接使用 __APP_INFO__
          __APP_INFO__: JSON.stringify({
            version: pkg.version,
            buildTime: new Date().toLocaleString(),
            env: mode
          })
        }
      };
    },

    // 2. 存储最终配置
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    // 3. 转换代码：生产环境下移除 console.log
    transform(code, id) {
      // 只处理 js/ts/vue 文件，且必须是生产环境构建
      if (config.command === 'build' && /\.(js|ts|vue)$/.test(id)) {
        if (code.includes('console.log')) {
          // 改进正则：通过匹配到分号或换行来确保整个语句被替换
          // 更好的做法是将 console.log 替换为一个空对象或空函数，避免语法断裂
          const newCode = code.replace(/console\.log\(.*?\)(?=$|;|\n)/g, '/* log removed */');
          
          return {
            code: newCode,
            map: null
          };
        }
      }
    },

    // 4. 构建结束后的钩子
    closeBundle() {
      if (config.command === 'build') {
        console.log('\n🎉 [Practical] 构建已完成！');
        console.log(`📦 版本: ${pkg.version}`);
        console.log(`⏰ 时间: ${new Date().toLocaleString()}\n`);
      }
    }
  };
}

