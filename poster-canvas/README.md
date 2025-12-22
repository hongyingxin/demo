# Canvas 海报生成器

提供两种实现方式：
1. **原生实现**：使用 SVG foreignObject + Canvas API（零依赖）
2. **插件实现**：使用 `html2canvas` 插件（功能完善）

## 📦 功能特性

- ✅ 将 DOM 元素转换为图片（原生实现 + html2canvas）
- ✅ 实时编辑海报内容
- ✅ 自定义标题、副标题、水印
- ✅ 上传自定义图片
- ✅ 高清图片导出（2倍分辨率）
- ✅ 一键下载生成的海报
- ✅ 响应式设计，支持移动端
- 🆕 **原生 DOM 转 Canvas 实现（无需插件）**
- 🆕 **两种方式对比演示**

## 🚀 快速开始

### 推荐：打开导航页

```bash
# 打开导航页（包含所有演示的入口）
open start.html
```

### 🎯 新增：原生实现演示

```bash
# 原生实现（零依赖）
open native-demo.html

# 对比演示（原生 vs html2canvas）
open comparison-demo.html
```

### 或直接打开具体页面

```bash
# 水印功能详解（推荐先看这个！）
open watermark-demo.html

# 主页面 - 交互式编辑器
open index.html

# 高级演示 - 4种模板
open advanced-demo.html
```

### 方式二：使用本地服务器（推荐）

```bash
# 如果你有 Python
python -m http.server 8080

# 如果你有 Node.js
npx http-server -p 8080

# 然后访问
http://localhost:8080
```

## 📄 文件说明

### HTML 演示页面

- **start.html** ⭐ - 导航页，快速访问所有演示（推荐从这里开始）
- **watermark-demo.html** 💧 - 水印功能详解，交互式演示（必看！）
- **index.html** 🎨 - 主页面，完整的海报生成器
- **advanced-demo.html** 🖼️ - 4种不同风格的海报模板
- 🆕 **native-demo.html** 🎯 - 原生实现演示（无需插件）
- 🆕 **comparison-demo.html** ⚡ - 两种方式对比演示

### JavaScript 核心代码

- **poster-generator.js** - html2canvas 实现（依赖插件）
- 🆕 **dom-to-canvas.js** - 原生实现（零依赖）

### 文档

- **README.md** - 本文档

## 🎯 原生 DOM 转 Canvas 实现

### 核心原理

使用 SVG `foreignObject` + Canvas API 实现：

```
DOM Element → Clone & Style → SVG foreignObject → Image → Canvas
```

### 基本用法

```javascript
// 1. 引入原生实现
<script src="dom-to-canvas.js"></script>

// 2. 转换 DOM 为 Canvas
const element = document.getElementById('posterContent');
const canvas = await domToCanvas(element, {
    scale: 2,                    // 缩放比例
    backgroundColor: '#ffffff',  // 背景色
    includeCss: true,            // 包含样式
    quality: 1.0                 // 质量
});

// 3. 转换为图片
const imgData = canvasToImage(canvas, 'image/png', 1.0);

// 4. 下载图片
await downloadCanvas(canvas, 'poster.png', 'image/png', 1.0);
```

### 添加水印

```javascript
// 单个水印
const canvas = addWatermarkToCanvas(canvas, '水印文本', {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.3)',
    rotation: -15,
    position: 'bottom-right'
});

// 平铺水印
const canvas = addTiledWatermarkToCanvas(canvas, '水印文本', {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.15)',
    rotation: -30,
    spacing: 200
});
```

### API 文档

#### `domToCanvas(element, options)`

将 DOM 元素转换为 Canvas。

**参数：**
- `element` (HTMLElement) - 要转换的 DOM 元素
- `options` (Object) - 配置选项
  - `scale` (number) - 缩放比例，默认 2
  - `backgroundColor` (string) - 背景色，默认 '#ffffff'
  - `includeCss` (boolean) - 是否包含样式，默认 true
  - `quality` (number) - 图片质量，0-1，默认 1.0

**返回：** Promise<HTMLCanvasElement>

#### `canvasToImage(canvas, format, quality)`

将 Canvas 转换为图片 Data URL。

**参数：**
- `canvas` (HTMLCanvasElement) - Canvas 元素
- `format` (string) - 图片格式，默认 'image/png'
- `quality` (number) - 图片质量，0-1，默认 1.0

**返回：** string (Data URL)

#### `downloadCanvas(canvas, filename, format, quality)`

下载 Canvas 为图片文件。

**参数：**
- `canvas` (HTMLCanvasElement) - Canvas 元素
- `filename` (string) - 文件名，默认 'image.png'
- `format` (string) - 图片格式，默认 'image/png'
- `quality` (number) - 图片质量，0-1，默认 1.0

**返回：** Promise<void>

### 优缺点对比

#### ✅ 优点

- 零依赖，无需额外加载第三方库
- 体积小，核心代码仅 ~5KB
- 性能好，生成速度快
- 代码简洁，易于理解和维护
- 自主可控，不受第三方库限制

#### ⚠️ 限制

- 浏览器兼容性：需要支持 SVG foreignObject（现代浏览器）
- CSS 支持：部分复杂 CSS 可能不完全支持
- 跨域图片：需要正确配置 CORS
- 复杂布局：适合简单到中等复杂度的布局

#### 📌 适用场景

- ✅ 海报生成
- ✅ 名片设计
- ✅ 证书制作
- ✅ 简单卡片
- ⚠️ 复杂页面截图（建议使用 html2canvas）

## 📖 html2canvas 使用说明

### 基本用法

```javascript
// 1. 获取要转换的 DOM 元素
const element = document.getElementById('posterContent');

// 2. 调用 html2canvas
html2canvas(element).then(canvas => {
    // 3. canvas 就是生成的画布
    document.body.appendChild(canvas);
});
```

### 常用配置选项

```javascript
html2canvas(element, {
    // 背景颜色，null 表示透明
    backgroundColor: null,
    
    // 缩放比例，提高清晰度
    scale: 2,
    
    // 是否允许跨域图片
    useCORS: true,
    allowTaint: true,
    
    // 指定生成的宽高
    width: element.offsetWidth,
    height: element.offsetHeight,
    
    // 滚动偏移
    scrollX: 0,
    scrollY: 0,
    
    // 图片加载超时时间（毫秒）
    imageTimeout: 0,
    
    // 是否显示日志
    logging: false,
    
    // 生成后移除临时容器
    removeContainer: true
});
```

### 导出图片

```javascript
// 方法 1：转换为 Data URL
const dataURL = canvas.toDataURL('image/png');
const img = document.createElement('img');
img.src = dataURL;

// 方法 2：转换为 Blob（用于下载）
canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'poster.png';
    link.href = url;
    link.click();
}, 'image/png', 1.0);

// 方法 3：转换为 File 对象（用于上传）
canvas.toBlob(blob => {
    const file = new File([blob], 'poster.png', { type: 'image/png' });
    // 上传 file
}, 'image/png');
```

## 🎨 核心代码示例

### 生成海报

```javascript
async function generatePoster() {
    const element = document.getElementById('posterContent');
    
    try {
        const canvas = await html2canvas(element, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            allowTaint: true
        });
        
        // 显示预览
        const imgData = canvas.toDataURL('image/png');
        document.getElementById('preview').innerHTML = 
            `<img src="${imgData}" alt="海报预览">`;
            
    } catch (error) {
        console.error('生成失败:', error);
    }
}
```

### 下载海报

```javascript
function downloadPoster(canvas) {
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `poster-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
}
```

### 添加水印

#### 方式1: 单个水印（适合版权标识）

```javascript
function addCustomWatermark(canvas, text, options = {}) {
    const ctx = canvas.getContext('2d');
    const {
        fontSize = 20,
        color = 'rgba(255, 255, 255, 0.3)',
        rotation = -15,
        position = 'bottom-right'  // 支持5个位置
    } = options;
    
    ctx.save();
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = color;
    
    // 计算位置
    const textWidth = ctx.measureText(text).width;
    const padding = 20;
    let x, y;
    
    switch(position) {
        case 'bottom-right':
            x = canvas.width - textWidth - padding;
            y = canvas.height - padding;
            break;
        case 'bottom-left':
            x = padding;
            y = canvas.height - padding;
            break;
        case 'top-right':
            x = canvas.width - textWidth - padding;
            y = padding + fontSize;
            break;
        case 'top-left':
            x = padding;
            y = padding + fontSize;
            break;
        case 'center':
            x = (canvas.width - textWidth) / 2;
            y = canvas.height / 2;
            break;
    }
    
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.fillText(text, 0, 0);
    ctx.restore();
    
    return canvas;
}

// 使用示例
html2canvas(element).then(canvas => {
    canvas = addCustomWatermark(canvas, '版权所有', {
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.5)',
        rotation: -15,
        position: 'bottom-right'
    });
});
```

#### 方式2: 平铺水印（适合内容保护）

```javascript
function addTiledWatermark(canvas, text, options = {}) {
    const ctx = canvas.getContext('2d');
    const {
        fontSize = 20,
        color = 'rgba(255, 255, 255, 0.15)',
        rotation = -30,
        spacing = 200  // 水印间距
    } = options;

    ctx.save();
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 计算需要的水印数量
    const cols = Math.ceil(canvas.width / spacing) + 1;
    const rows = Math.ceil(canvas.height / spacing) + 1;

    // 平铺水印
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * spacing;
            const y = j * spacing;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
    }

    ctx.restore();
    return canvas;
}

// 使用示例
html2canvas(element).then(canvas => {
    canvas = addTiledWatermark(canvas, 'CONFIDENTIAL', {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.1)',
        rotation: -30,
        spacing: 250
    });
});
```

#### 水印参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fontSize` | number | 20 | 字体大小（像素） |
| `color` | string | rgba() | 颜色（支持 RGBA） |
| `rotation` | number | -15/-30 | 旋转角度（度） |
| `position` | string | 'bottom-right' | 位置（仅单个水印） |
| `spacing` | number | 200 | 间距（仅平铺水印） |

**支持的位置（position）：**
- `bottom-right` - 右下角
- `bottom-left` - 左下角
- `top-right` - 右上角
- `top-left` - 左上角
- `center` - 居中

💡 **提示：** 打开 `watermark-demo.html` 查看交互式水印演示！

## 🔧 常见问题

### 1. 跨域图片问题

如果海报中包含跨域图片，需要：

```javascript
// 设置允许跨域
html2canvas(element, {
    useCORS: true,
    allowTaint: true
});

// 图片标签需要设置 crossorigin
<img src="..." crossorigin="anonymous">
```

### 2. 图片不清晰

```javascript
// 提高 scale 值
html2canvas(element, {
    scale: 2  // 或更高的值
});
```

### 3. 某些 CSS 样式不支持

html2canvas 不支持所有 CSS 特性，已知限制：
- 某些 CSS3 特效可能无法渲染
- `box-shadow` 可能显示不正确
- 背景渐变在某些情况下可能失真

解决方案：使用替代的 CSS 实现或调整样式。

### 4. 内容被截断

```javascript
// 确保设置正确的宽高
html2canvas(element, {
    width: element.scrollWidth,
    height: element.scrollHeight
});
```

## 📚 进阶应用

### 1. 生成分享海报
- 添加二维码
- 自定义用户信息
- 动态生成优惠券

### 2. 批量生成
- 使用模板引擎
- 循环生成多张海报
- 打包下载

### 3. 与其他库结合
- 配合 QRCode.js 生成二维码
- 使用 Fabric.js 做更复杂的编辑
- 结合 Cropper.js 裁剪图片

## 🔗 相关资源

- [html2canvas 官方文档](https://html2canvas.hertzen.com/)
- [html2canvas GitHub](https://github.com/niklasvh/html2canvas)
- [Canvas API 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)

## 📝 许可

MIT License

