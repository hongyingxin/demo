# 原生 DOM 转 Canvas 实现原理

本文档详细说明如何在不使用 html2canvas 插件的情况下，使用原生 JavaScript 实现 DOM 到 Canvas 再到图片的转换。

## 📚 目录

1. [核心原理](#核心原理)
2. [技术栈](#技术栈)
3. [实现步骤](#实现步骤)
4. [关键技术点](#关键技术点)
5. [优化技巧](#优化技巧)
6. [常见问题](#常见问题)

---

## 核心原理

### 转换流程

```
┌─────────────┐
│  DOM 元素   │
└──────┬──────┘
       │ 1. 克隆元素
       ↓
┌─────────────┐
│ 克隆的 DOM  │
└──────┬──────┘
       │ 2. 复制样式
       ↓
┌─────────────┐
│  样式化 DOM │
└──────┬──────┘
       │ 3. 序列化为 HTML
       ↓
┌─────────────┐
│ HTML 字符串 │
└──────┬──────┘
       │ 4. 嵌入 SVG foreignObject
       ↓
┌─────────────┐
│ SVG Data URL│
└──────┬──────┘
       │ 5. 加载为图片
       ↓
┌─────────────┐
│   Image     │
└──────┬──────┘
       │ 6. 绘制到 Canvas
       ↓
┌─────────────┐
│   Canvas    │
└──────┬──────┘
       │ 7. 导出为图片
       ↓
┌─────────────┐
│  PNG/JPEG   │
└─────────────┘
```

### 关键技术

1. **SVG foreignObject**：允许在 SVG 中嵌入 HTML 内容
2. **XMLSerializer**：将 DOM 序列化为 XML 字符串
3. **Canvas API**：提供图像绘制和导出功能
4. **Data URL**：将数据转换为可嵌入的 URL 格式

---

## 技术栈

### 核心 Web API

- **DOM API**
  - `cloneNode()` - 克隆 DOM 节点
  - `getComputedStyle()` - 获取元素的计算样式
  
- **SVG**
  - `<foreignObject>` - 嵌入外部内容
  - `XMLSerializer` - 序列化 XML
  
- **Canvas API**
  - `getContext('2d')` - 获取 2D 绘图上下文
  - `drawImage()` - 绘制图像
  - `toDataURL()` - 导出为 Data URL
  - `toBlob()` - 导出为 Blob
  
- **Image API**
  - `Image` 构造函数
  - `onload` / `onerror` 事件

### 数据格式

- **Data URL**：`data:image/svg+xml;charset=utf-8,...`
- **Blob**：二进制大对象
- **Object URL**：`blob:...`

---

## 实现步骤

### 步骤 1：克隆元素

```javascript
const cloned = element.cloneNode(true);
```

**作用**：
- 创建元素的深度副本
- 避免修改原始 DOM
- 保留所有子元素

### 步骤 2：复制计算样式

```javascript
function copyComputedStyles(source, target) {
    const computedStyles = window.getComputedStyle(source);
    const cssText = [];

    // 遍历所有样式属性
    for (let i = 0; i < computedStyles.length; i++) {
        const key = computedStyles[i];
        const value = computedStyles.getPropertyValue(key);
        cssText.push(`${key}: ${value}`);
    }

    // 应用到目标元素
    target.style.cssText = cssText.join('; ');

    // 递归处理子元素
    const sourceChildren = source.children;
    const targetChildren = target.children;
    for (let i = 0; i < sourceChildren.length; i++) {
        copyComputedStyles(sourceChildren[i], targetChildren[i]);
    }
}
```

**重点**：
- 使用 `getComputedStyle()` 获取最终样式（包括继承和层叠）
- 递归处理所有子元素
- 将样式内联到元素上

### 步骤 3：处理图片

```javascript
async function processImages(element) {
    const images = element.querySelectorAll('img');
    const promises = [];

    images.forEach(img => {
        const promise = new Promise((resolve) => {
            // 如果已经是 Data URL，跳过
            if (img.src.startsWith('data:')) {
                resolve();
                return;
            }

            // 创建新图片对象
            const newImg = new Image();
            newImg.crossOrigin = 'anonymous';
            
            newImg.onload = function() {
                // 转换为 Canvas
                const canvas = document.createElement('canvas');
                canvas.width = newImg.naturalWidth;
                canvas.height = newImg.naturalHeight;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(newImg, 0, 0);
                
                // 转换为 Data URL
                img.src = canvas.toDataURL('image/png');
                resolve();
            };

            newImg.onerror = () => resolve(); // 失败也继续
            newImg.src = img.src;
        });

        promises.push(promise);
    });

    await Promise.all(promises);
}
```

**目的**：
- 将外部图片转换为 Data URL
- 避免跨域问题
- 确保图片可以被序列化

### 步骤 4：创建 SVG foreignObject

```javascript
function domToSvg(element, width, height) {
    // 序列化 HTML
    const htmlString = new XMLSerializer().serializeToString(element);
    
    // 创建 SVG
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml">
                    ${htmlString}
                </div>
            </foreignObject>
        </svg>
    `;

    // 转换为 Data URL
    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    
    return svgDataUrl;
}
```

**关键点**：
- `foreignObject` 允许在 SVG 中嵌入 HTML
- 必须声明正确的 XML 命名空间
- 使用 `encodeURIComponent()` 编码特殊字符

### 步骤 5：加载 SVG 为图片

```javascript
function loadSvgAsImage(svgDataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
        
        img.src = svgDataUrl;
    });
}
```

**注意**：
- 图片加载是异步的，必须等待 `onload`
- 处理加载失败的情况

### 步骤 6：绘制到 Canvas

```javascript
function drawImageToCanvas(img, width, height, scale, backgroundColor) {
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    const ctx = canvas.getContext('2d');
    
    // 设置背景色
    if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // 缩放并绘制
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, width, height);
    
    return canvas;
}
```

**要点**：
- 使用 `scale` 参数提高分辨率（高清输出）
- 先填充背景色，再绘制图像
- 注意缩放顺序：先 `scale()`，再 `drawImage()`

### 步骤 7：导出为图片

```javascript
// 方式 1：Data URL
const dataUrl = canvas.toDataURL('image/png', 1.0);

// 方式 2：Blob
canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    // 使用 url 进行下载或其他操作
}, 'image/png', 1.0);
```

---

## 关键技术点

### 1. SVG foreignObject

`foreignObject` 是 SVG 的一个元素，允许在 SVG 中嵌入非 SVG 内容（如 HTML）。

**语法**：
```xml
<svg xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="200" height="200">
        <div xmlns="http://www.w3.org/1999/xhtml">
            <!-- HTML 内容 -->
        </div>
    </foreignObject>
</svg>
```

**注意事项**：
- 必须声明 SVG 命名空间：`xmlns="http://www.w3.org/2000/svg"`
- 内部 HTML 必须声明 XHTML 命名空间：`xmlns="http://www.w3.org/1999/xhtml"`
- 不是所有浏览器都完全支持（但现代浏览器都支持）

### 2. XMLSerializer

将 DOM 节点序列化为 XML 字符串。

```javascript
const serializer = new XMLSerializer();
const xmlString = serializer.serializeToString(element);
```

**特点**：
- 生成的是有效的 XML
- 保留属性和子元素
- 不保留事件监听器

### 3. Canvas 缩放

```javascript
ctx.scale(scaleX, scaleY);
```

**用途**：
- 提高输出分辨率（如 `scale(2, 2)` 生成 2 倍清晰度）
- 在高 DPI 屏幕上保持清晰

**注意**：
- 缩放会影响后续所有绘制操作
- Canvas 尺寸也要相应增加

### 4. 跨域图片处理

```javascript
const img = new Image();
img.crossOrigin = 'anonymous'; // 关键！
img.src = 'https://example.com/image.jpg';
```

**CORS 要求**：
- 服务器必须返回 `Access-Control-Allow-Origin` 头
- 设置 `crossOrigin = 'anonymous'` 请求匿名访问
- 否则会污染 Canvas，无法导出

---

## 优化技巧

### 1. 性能优化

```javascript
// 使用 requestAnimationFrame 避免阻塞
function optimizedGenerate() {
    return new Promise((resolve) => {
        requestAnimationFrame(async () => {
            const canvas = await domToCanvas(element);
            resolve(canvas);
        });
    });
}
```

### 2. 内存优化

```javascript
// 及时释放 Object URL
const url = URL.createObjectURL(blob);
// 使用完后释放
setTimeout(() => URL.revokeObjectURL(url), 100);
```

### 3. 样式优化

```javascript
// 只复制必要的样式，减少序列化数据量
const importantStyles = [
    'width', 'height', 'padding', 'margin',
    'color', 'background', 'font-size', 'font-family',
    'border', 'border-radius', 'box-shadow'
];

function copyImportantStyles(source, target) {
    const computed = window.getComputedStyle(source);
    importantStyles.forEach(prop => {
        target.style[prop] = computed[prop];
    });
}
```

### 4. 错误处理

```javascript
async function safeGenerate(element) {
    try {
        return await domToCanvas(element);
    } catch (error) {
        console.error('生成失败:', error);
        // 降级方案
        return generateFallback(element);
    }
}
```

---

## 常见问题

### Q1: 为什么生成的图片是空白的？

**可能原因**：
1. 图片跨域问题 → 设置 `crossOrigin = 'anonymous'`
2. 样式未正确复制 → 检查 CSS 是否内联
3. SVG 命名空间错误 → 确认 `xmlns` 声明正确

### Q2: 为什么某些 CSS 样式没有生效？

**解决方案**：
- 使用 `getComputedStyle()` 获取最终样式
- 将外部样式表的规则内联到元素上
- 某些伪元素（如 `::before`）可能无法捕获

### Q3: 如何提高生成图片的清晰度？

**方法**：
```javascript
// 增加 scale 参数
const canvas = await domToCanvas(element, {
    scale: 3  // 3倍分辨率，更清晰但文件更大
});
```

### Q4: 支持哪些浏览器？

**兼容性**：
- ✅ Chrome 50+
- ✅ Firefox 52+
- ✅ Safari 10+
- ✅ Edge 79+
- ⚠️ IE 11（部分支持，foreignObject 有限制）

### Q5: 与 html2canvas 相比有什么优缺点？

**优点**：
- ✅ 零依赖，体积小
- ✅ 代码简洁，易于理解
- ✅ 生成速度快
- ✅ 自主可控

**缺点**：
- ⚠️ CSS 支持不如 html2canvas 完善
- ⚠️ 复杂布局可能有问题
- ⚠️ 浏览器兼容性要求较高

---

## 完整示例

```javascript
/**
 * 完整的 DOM 转 Canvas 流程
 */
async function fullExample() {
    // 1. 获取元素
    const element = document.getElementById('poster');
    
    // 2. 转换为 Canvas
    const canvas = await domToCanvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        includeCss: true
    });
    
    // 3. 添加水印
    const watermarkedCanvas = addWatermarkToCanvas(canvas, '@MyBrand', {
        position: 'bottom-right',
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.3)'
    });
    
    // 4. 导出并下载
    await downloadCanvas(watermarkedCanvas, 'poster.png', 'image/png', 1.0);
    
    console.log('✅ 完成！');
}
```

---

## 总结

原生实现 DOM 转 Canvas 的核心思路是：

1. **克隆并样式化** DOM 元素
2. 利用 **SVG foreignObject** 嵌入 HTML
3. 将 SVG 作为图片加载
4. 绘制到 **Canvas** 并导出

这种方法适合简单到中等复杂度的场景，如海报生成、证书制作等。对于更复杂的页面截图需求，html2canvas 仍然是更好的选择。

---

## 参考资源

- [MDN - SVG foreignObject](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject)
- [MDN - Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN - XMLSerializer](https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer)
- [CORS 跨域资源共享](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**作者**：Canvas 海报生成器项目组  
**日期**：2025年  
**许可**：MIT License

