/**
 * 原生 DOM 转 Canvas 实现
 * 不依赖 html2canvas，使用 SVG foreignObject + Canvas API
 */

/**
 * 核心功能：将 DOM 元素转换为 Canvas
 * @param {HTMLElement} element - 要转换的 DOM 元素
 * @param {Object} options - 配置选项
 * @returns {Promise<HTMLCanvasElement>}
 */
async function domToCanvas(element, options = {}) {
    const {
        scale = 2,              // 缩放比例，提高清晰度
        backgroundColor = '#ffffff',  // 背景色
        width = null,           // 自定义宽度
        height = null,          // 自定义高度
        quality = 1.0,          // 图片质量
        includeCss = true,      // 是否包含样式
    } = options;

    try {
        // 1. 获取元素尺寸
        const rect = element.getBoundingClientRect();
        const elementWidth = width || rect.width;
        const elementHeight = height || rect.height;

        console.log('📐 元素尺寸:', { width: elementWidth, height: elementHeight });

        // 2. 克隆元素并处理样式
        const clonedElement = await cloneElementWithStyles(element, includeCss);

        // 3. 将 DOM 转换为 SVG
        const svgDataUrl = await domToSvg(clonedElement, elementWidth, elementHeight);

        // 4. 将 SVG 绘制到 Canvas
        const canvas = await svgToCanvas(svgDataUrl, elementWidth, elementHeight, scale, backgroundColor);

        console.log('✅ DOM 转 Canvas 成功！', {
            originalSize: `${elementWidth}x${elementHeight}`,
            canvasSize: `${canvas.width}x${canvas.height}`,
            scale: scale
        });

        return canvas;

    } catch (error) {
        console.error('❌ DOM 转 Canvas 失败:', error);
        throw error;
    }
}

/**
 * 克隆元素并保留计算样式
 * @param {HTMLElement} element 
 * @param {boolean} includeCss 
 * @returns {Promise<HTMLElement>}
 */
async function cloneElementWithStyles(element, includeCss) {
    // 深度克隆元素
    const cloned = element.cloneNode(true);

    if (!includeCss) {
        return cloned;
    }

    // 递归复制所有计算样式
    function copyComputedStyles(source, target) {
        const computedStyles = window.getComputedStyle(source);
        const cssText = [];

        // 复制所有样式属性
        for (let i = 0; i < computedStyles.length; i++) {
            const key = computedStyles[i];
            const value = computedStyles.getPropertyValue(key);
            cssText.push(`${key}: ${value}`);
        }

        target.style.cssText = cssText.join('; ');

        // 递归处理子元素
        const sourceChildren = source.children;
        const targetChildren = target.children;

        for (let i = 0; i < sourceChildren.length; i++) {
            copyComputedStyles(sourceChildren[i], targetChildren[i]);
        }
    }

    copyComputedStyles(element, cloned);

    // 处理图片：将图片转换为 base64
    await processImages(cloned);

    return cloned;
}

/**
 * 处理图片，转换为 base64
 * @param {HTMLElement} element 
 */
async function processImages(element) {
    const images = element.querySelectorAll('img');
    const promises = [];

    images.forEach(img => {
        const promise = new Promise((resolve) => {
            // 如果图片已经是 base64 或者 data URL，直接返回
            if (img.src.startsWith('data:')) {
                resolve();
                return;
            }

            // 创建新图片对象
            const newImg = new Image();
            newImg.crossOrigin = 'anonymous';
            
            newImg.onload = function() {
                try {
                    // 将图片绘制到 canvas 并转换为 base64
                    const canvas = document.createElement('canvas');
                    canvas.width = newImg.naturalWidth;
                    canvas.height = newImg.naturalHeight;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(newImg, 0, 0);
                    
                    // 转换为 base64
                    const dataUrl = canvas.toDataURL('image/png');
                    img.src = dataUrl;
                } catch (error) {
                    console.warn('图片转换失败:', img.src, error);
                }
                resolve();
            };

            newImg.onerror = function() {
                console.warn('图片加载失败:', img.src);
                resolve();
            };

            newImg.src = img.src;
        });

        promises.push(promise);
    });

    await Promise.all(promises);
}

/**
 * 将 DOM 转换为 SVG Data URL
 * @param {HTMLElement} element 
 * @param {number} width 
 * @param {number} height 
 * @returns {Promise<string>}
 */
function domToSvg(element, width, height) {
    return new Promise((resolve, reject) => {
        try {
            // 将 HTML 序列化
            const htmlString = new XMLSerializer().serializeToString(element);
            
            // 创建 SVG 包装器，使用 foreignObject
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
            const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            // 或者直接使用 base64
            const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
            
            resolve(svgDataUrl);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 将 SVG 绘制到 Canvas
 * @param {string} svgDataUrl 
 * @param {number} width 
 * @param {number} height 
 * @param {number} scale 
 * @param {string} backgroundColor 
 * @returns {Promise<HTMLCanvasElement>}
 */
function svgToCanvas(svgDataUrl, width, height, scale, backgroundColor) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = function() {
            try {
                // 创建 Canvas
                const canvas = document.createElement('canvas');
                canvas.width = width * scale;
                canvas.height = height * scale;
                
                const ctx = canvas.getContext('2d');
                
                // 设置背景色
                if (backgroundColor) {
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                // 缩放并绘制图片
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve(canvas);
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = function(error) {
            reject(new Error('SVG 图片加载失败: ' + error));
        };
        
        img.src = svgDataUrl;
    });
}

/**
 * Canvas 转图片 Data URL
 * @param {HTMLCanvasElement} canvas 
 * @param {string} format - image/png, image/jpeg, image/webp
 * @param {number} quality - 0-1
 * @returns {string}
 */
function canvasToImage(canvas, format = 'image/png', quality = 1.0) {
    return canvas.toDataURL(format, quality);
}

/**
 * Canvas 转 Blob
 * @param {HTMLCanvasElement} canvas 
 * @param {string} format 
 * @param {number} quality 
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas, format = 'image/png', quality = 1.0) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Canvas 转 Blob 失败'));
            }
        }, format, quality);
    });
}

/**
 * 下载 Canvas 为图片文件
 * @param {HTMLCanvasElement} canvas 
 * @param {string} filename 
 * @param {string} format 
 * @param {number} quality 
 */
async function downloadCanvas(canvas, filename = 'image.png', format = 'image/png', quality = 1.0) {
    try {
        const blob = await canvasToBlob(canvas, format, quality);
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        console.log('✅ 下载成功:', filename);
    } catch (error) {
        console.error('❌ 下载失败:', error);
        throw error;
    }
}

/**
 * 添加水印到 Canvas
 * @param {HTMLCanvasElement} canvas 
 * @param {string} text 
 * @param {Object} options 
 * @returns {HTMLCanvasElement}
 */
function addWatermarkToCanvas(canvas, text, options = {}) {
    const {
        fontSize = 20,
        fontFamily = 'Arial',
        color = 'rgba(255, 255, 255, 0.3)',
        rotation = -15,
        position = 'bottom-right',
        padding = 20
    } = options;

    const ctx = canvas.getContext('2d');
    ctx.save();
    
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    
    // 计算位置
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
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
        default:
            x = canvas.width - textWidth - padding;
            y = canvas.height - padding;
    }
    
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.fillText(text, 0, 0);
    ctx.restore();
    
    return canvas;
}

/**
 * 添加平铺水印
 * @param {HTMLCanvasElement} canvas 
 * @param {string} text 
 * @param {Object} options 
 * @returns {HTMLCanvasElement}
 */
function addTiledWatermarkToCanvas(canvas, text, options = {}) {
    const {
        fontSize = 24,
        fontFamily = 'Arial',
        color = 'rgba(255, 255, 255, 0.15)',
        rotation = -30,
        spacing = 200
    } = options;

    const ctx = canvas.getContext('2d');
    ctx.save();
    
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const cols = Math.ceil(canvas.width / spacing) + 1;
    const rows = Math.ceil(canvas.height / spacing) + 1;

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

// 导出所有函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        domToCanvas,
        canvasToImage,
        canvasToBlob,
        downloadCanvas,
        addWatermarkToCanvas,
        addTiledWatermarkToCanvas
    };
}

