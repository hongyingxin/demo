import type { Plugin } from 'vite';
import path from 'path';

/**
 * 一个简单的 Vite 插件，用于统计构建过程中处理的文件类型、数量和总大小。
 */
export function vitePluginStats(options = { includeNodeModules: false }): Plugin {
  // 用于存储统计数据的 Map
  const stats = new Map<string, { count: number; size: number }>();
  let startTime = 0;
  let config: any;

  return {
    name: 'vite-plugin-stats',

    // 获取 Vite 配置，判断当前环境
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    // 构建开始时重置统计信息
    buildStart() {
      if (config.command === 'build') {
        startTime = Date.now();
        stats.clear();
      }
    },

    // 在转换每个文件时记录数据
    transform(code, id) {
      // 我们只在构建模式下进行统计
      if (config.command !== 'build') {
        return null;
      }

      // 根据配置决定是否排除 node_modules
      if (!options.includeNodeModules && id.includes('node_modules')) {
        return null;
      }

      // 获取文件后缀名
      const ext = path.extname(id).split('?')[0] || 'no-extension';
      
      // 更新统计数据
      const current = stats.get(ext) || { count: 0, size: 0 };
      stats.set(ext, {
        count: current.count + 1,
        size: current.size + Buffer.byteLength(code, 'utf-8')
      });

      return null; // 不修改代码，只做统计
    },

    // 构建结束时输出报告
    closeBundle() {
      if (config.command !== 'build') return;

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      console.log('\n📊 \x1b[36m--- Vite 构建统计报告 ---\x1b[0m');
      console.log(`⏱️  编译总耗时: \x1b[33m${duration}s\x1b[0m`);
      console.log('-------------------------------------------');
      console.log('| 类型\t\t| 数量\t| 大小 (KB)\t|');
      console.log('-------------------------------------------');

      let totalFiles = 0;
      let totalSize = 0;

      // 按照数量排序输出
      const sortedStats = Array.from(stats.entries()).sort((a, b) => b[1].count - a[1].count);

      for (const [ext, data] of sortedStats) {
        const sizeKB = (data.size / 1024).toFixed(2);
        const padding = ext.length < 8 ? '\t\t' : '\t';
        console.log(`| ${ext}${padding}| ${data.count}\t| ${sizeKB}\t\t|`);
        totalFiles += data.count;
        totalSize += data.size;
      }

      console.log('-------------------------------------------');
      console.log(`\x1b[32m总计: ${totalFiles} 个文件, ${(totalSize / 1024).toFixed(2)} KB\x1b[0m`);
      console.log('-------------------------------------------\n');
    }
  };
}

