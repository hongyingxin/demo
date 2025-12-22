/**
 * Canvas 海报生成器 - 使用 html2canvas
 * 功能：将 DOM 元素转换为 Canvas 图片，支持下载
 */

let generatedCanvas = null;

/**
 * 实时更新海报内容
 */
function updatePoster() {
    const title = document.getElementById('titleInput').value;
    const subtitle = document.getElementById('subtitleInput').value;
    const watermark = document.getElementById('watermarkInput').value;

    document.getElementById('posterTitle').textContent = title;
    document.getElementById('posterSubtitle').textContent = subtitle;
    document.getElementById('watermark').textContent = watermark;
}

/**
 * 处理图片上传
 */
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }

    // 验证文件大小（限制 5MB）
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB！');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'cover';

        const posterImage = document.getElementById('posterImage');
        posterImage.innerHTML = '';
        posterImage.appendChild(img);
    };
    reader.readAsDataURL(file);
}

/**
 * 生成海报 - 使用 html2canvas
 */
async function generatePoster() {
    const posterContent = document.getElementById('posterContent');
    const previewArea = document.getElementById('previewArea');
    const downloadBtn = document.getElementById('downloadBtn');

    // 显示加载状态
    previewArea.innerHTML = '<div class="loading">🎨 正在生成海报...</div>';
    downloadBtn.disabled = true;

    try {
        // 使用 html2canvas 将 DOM 转换为 Canvas
        let canvas = await html2canvas(posterContent, {
            backgroundColor: null, // 透明背景
            scale: 2, // 提高清晰度（2倍分辨率）
            logging: false, // 关闭日志
            useCORS: true, // 允许跨域图片
            allowTaint: true, // 允许跨域图片污染画布
            imageTimeout: 0, // 图片加载超时时间
            removeContainer: true, // 移除临时容器
            // 优化配置
            width: posterContent.offsetWidth,
            height: posterContent.offsetHeight,
            scrollX: 0,
            scrollY: 0,
        });

        // 获取水印配置
        const watermarkType = document.getElementById('watermarkType').value;
        const watermarkText = document.getElementById('watermarkInput').value;
        const watermarkPosition = document.getElementById('watermarkPosition').value;

        // 根据选择的水印类型添加水印
        if (watermarkType === 'single') {
            // 单个水印
            canvas = addCustomWatermark(canvas, watermarkText, {
                fontSize: 20,
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -15,
                position: watermarkPosition
            });
            console.log('✓ 已添加单个水印:', watermarkText, '位置:', watermarkPosition);
        } else if (watermarkType === 'tiled') {
            // 平铺水印
            canvas = addTiledWatermark(canvas, watermarkText, {
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.15)',
                rotation: -30,
                spacing: 200
            });
            console.log('✓ 已添加平铺水印:', watermarkText);
        } else {
            console.log('✓ 无水印模式');
        }

        // 保存生成的 canvas
        generatedCanvas = canvas;

        // 将 Canvas 转换为图片并显示
        const imgData = canvas.toDataURL('image/png');
        previewArea.innerHTML = `
            <img src="${imgData}" alt="生成的海报" class="preview-image">
            <div style="text-align: center; margin-top: 15px; color: #666;">
                <p>✅ 海报生成成功！分辨率: ${canvas.width} × ${canvas.height}</p>
                <p style="margin-top: 5px;">水印类型: ${watermarkType === 'none' ? '无水印' : watermarkType === 'single' ? '单个水印' : '平铺水印'}</p>
            </div>
        `;

        // 启用下载按钮
        downloadBtn.disabled = false;

        console.log('海报生成成功！', {
            width: canvas.width,
            height: canvas.height,
            watermark: watermarkType,
            size: Math.round(imgData.length / 1024) + ' KB'
        });

    } catch (error) {
        console.error('生成海报失败:', error);
        previewArea.innerHTML = `
            <div style="text-align: center; color: #e53e3e; padding: 40px;">
                ❌ 生成失败：${error.message}
            </div>
        `;
    }
}

/**
 * 下载生成的海报
 */
function downloadPoster() {
    if (!generatedCanvas) {
        alert('请先生成海报！');
        return;
    }

    try {
        // 将 Canvas 转换为 Blob
        generatedCanvas.toBlob(function(blob) {
            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const timestamp = new Date().getTime();
            link.download = `poster-${timestamp}.png`;
            link.href = url;
            
            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 释放 URL 对象
            setTimeout(() => URL.revokeObjectURL(url), 100);
            
            console.log('海报下载成功！');
        }, 'image/png', 1.0);

    } catch (error) {
        console.error('下载失败:', error);
        alert('下载失败，请重试！');
    }
}

/**
 * 高级功能：添加自定义水印
 */
function addCustomWatermark(canvas, text, options = {}) {
    const ctx = canvas.getContext('2d');
    const {
        fontSize = 20,
        color = 'rgba(0, 0, 0, 0.2)',
        rotation = -15,
        position = 'bottom-right'
    } = options;

    ctx.save();
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = color;
    
    // 根据位置设置坐标
    let x, y;
    const padding = 20;
    const textWidth = ctx.measureText(text).width;
    
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
 * 高级功能：添加重复水印（平铺效果）
 */
function addTiledWatermark(canvas, text, options = {}) {
    const ctx = canvas.getContext('2d');
    const {
        fontSize = 20,
        color = 'rgba(0, 0, 0, 0.1)',
        rotation = -30,
        spacing = 200
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

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Canvas 海报生成器已加载');
    console.log('📦 html2canvas 版本:', html2canvas ? '已加载' : '未加载');
});

