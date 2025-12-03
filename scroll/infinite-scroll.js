/**
 * InfiniteScroll Web Component
 * 一个纯粹的无限滚动检测组件，只负责检测滚动和触发事件
 * 
 * ===== 使用方式 =====
 * <infinite-scroll threshold="100" loading="false" has-more="true">
 *   <div>你的内容列表</div>
 *   <!-- 自定义加载中提示 -->
 *   <div slot="loading">加载中...</div>
 *   <!-- 自定义加载完成提示 -->
 *   <div slot="end">没有更多了</div>
 *   <!-- 自定义错误提示 -->
 *   <div slot="error">加载失败</div>
 * </infinite-scroll>
 * 
 * ===== 属性 (Attributes) =====
 * @property {string} threshold - 触发加载的距离阈值（像素），默认 0
 *   示例: threshold="100" 表示距离底部 100px 时触发加载
 * 
 * @property {string} loading - 是否正在加载，控制加载状态显示，默认 "false"
 *   示例: loading="true" 显示加载中状态，loading="false" 隐藏加载状态
 * 
 * @property {string} has-more - 是否还有更多数据，默认 "true"
 *   示例: has-more="true" 继续监听滚动，has-more="false" 显示"没有更多"并停止监听
 * 
 * @property {string} use-observer - 是否使用 IntersectionObserver，默认 "true"
 *   示例: use-observer="true" 启用 Observer 检测（推荐）
 * 
 * @property {string} use-scroll - 是否使用滚动事件监听，默认 "true"
 *   示例: use-scroll="true" 启用滚动事件检测（兼容降级）
 * 
 * ===== 事件 (Events) =====
 * @event load - 当需要加载更多数据时触发
 *   event.detail = { timestamp: 时间戳 }
 *   使用: element.addEventListener('load', (e) => { ... })
 * 
 * ===== 方法 (Methods) =====
 * @method reset() - 重置组件到初始状态
 *   使用: element.reset()
 * 
 * @method scrollToTop() - 滚动到顶部
 *   使用: element.scrollToTop()
 * 
 * @method showError() - 显示错误状态
 *   使用: element.showError()
 * 
 * @method hideError() - 隐藏错误状态
 *   使用: element.hideError()
 * 
 * ===== 插槽 (Slots) =====
 * @slot (default) - 默认插槽，放置滚动内容
 * @slot loading - 加载中状态的自定义内容
 * @slot end - 加载完成（没有更多）状态的自定义内容
 * @slot error - 错误状态的自定义内容
 * 
 * ===== 完整示例 =====
 * const scroll = document.querySelector('infinite-scroll');
 * 
 * // 监听加载事件
 * scroll.addEventListener('load', async (e) => {
 *   scroll.loading = true;  // 显示加载中
 *   try {
 *     const data = await fetchData();
 *     if (data.length === 0) {
 *       scroll.hasMore = false;  // 没有更多数据
 *     }
 *     renderData(data);
 *   } catch (error) {
 *     scroll.showError();  // 显示错误
 *   } finally {
 *     scroll.loading = false;  // 隐藏加载中
 *   }
 * });
 * 
 * ===== 特性 =====
 * - 支持 IntersectionObserver 和滚动事件两种检测方式
 * - 提供加载中、加载完成、错误等状态显示
 * - 支持自定义插槽内容
 * - 自动节流优化性能
 * - Shadow DOM 封装，样式隔离
 */
class InfiniteScroll extends HTMLElement {
    constructor() {
        super();
        // 创建 Shadow DOM，提供样式隔离和封装
        this.attachShadow({ mode: 'open' });
        
        // 内部状态
        this._observer = null;          // IntersectionObserver 实例
        this._scrollHandler = null;     // 滚动事件处理函数
        this._isLoading = false;        // 是否正在加载数据
        this._hasMore = true;           // 是否还有更多数据
        
        // 配置参数
        this._threshold = 0;            // 触发加载的距离阈值（像素）
        this._useObserver = true;       // 是否使用 IntersectionObserver
        this._useScroll = true;         // 是否使用滚动事件监听
        this._throttleDelay = 200;      // 滚动事件节流延迟（毫秒）
    }
    
    /**
     * 定义需要观察的属性列表
     * 当这些属性发生变化时，会触发 attributeChangedCallback
     * @returns {string[]} 观察的属性名称数组
     */
    static get observedAttributes() {
        return ['threshold', 'use-observer', 'use-scroll', 'loading', 'has-more'];
    }
    
    /**
     * 属性变化回调函数
     * 当 observedAttributes 中的属性发生变化时自动调用
     * @param {string} name - 变化的属性名
     * @param {string} oldValue - 旧值
     * @param {string} newValue - 新值
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'threshold':
                // 设置触发加载的距离阈值
                this._threshold = parseInt(newValue) || 0;
                this._updateObserver();
                break;
            case 'use-observer':
                // 控制是否使用 IntersectionObserver
                this._useObserver = newValue !== 'false';
                this._setupDetection();
                break;
            case 'use-scroll':
                // 控制是否使用滚动事件监听
                this._useScroll = newValue !== 'false';
                this._setupDetection();
                break;
            case 'loading':
                // 更新加载状态
                this._isLoading = newValue === 'true';
                this._updateLoadingState();
                break;
            case 'has-more':
                // 更新是否还有更多数据的状态
                this._hasMore = newValue !== 'false';
                this._updateEndState();
                break;
        }
    }
    
    /**
     * 组件连接到 DOM 时的生命周期回调
     * 在组件被插入到文档时调用
     */
    connectedCallback() {
        this._render();           // 渲染组件内容
        this._setupDetection();   // 设置滚动检测
    }
    
    /**
     * 组件从 DOM 断开时的生命周期回调
     * 在组件被移除时调用，用于清理资源
     */
    disconnectedCallback() {
        this._cleanup();
    }
    
    /**
     * 渲染组件的 Shadow DOM 内容
     * 包括样式、结构和各种状态插槽
     * @private
     */
    _render() {
        const style = `
            <style>
                :host {
                    display: block;
                    position: relative;
                }
                
                .scroll-container {
                    height: 100%;
                    overflow-y: auto;
                    position: relative;
                }
                
                .sentinel {
                    height: 1px;
                    margin-top: 1px;
                }
                
                /* 插槽容器样式 */
                .state-container {
                    text-align: center;
                    padding: 20px;
                }
                
                /* 默认加载中样式 */
                .default-loading {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .hidden {
                    display: none !important;
                }
            </style>
        `;
        
        const template = `
            <div class="scroll-container">
                <slot></slot>
                
                <!-- 加载中状态 -->
                <div class="state-container loading-container hidden">
                    <slot name="loading">
                        <div class="default-loading"></div>
                    </slot>
                </div>
                
                <!-- 哨兵元素 -->
                <div class="sentinel"></div>
                
                <!-- 加载完成状态 -->
                <div class="state-container end-container hidden">
                    <slot name="end">
                        <div>没有更多内容了</div>
                    </slot>
                </div>
                
                <!-- 错误状态 -->
                <div class="state-container error-container hidden">
                    <slot name="error">
                        <div>加载失败，请重试</div>
                    </slot>
                </div>
            </div>
        `;
        
        this.shadowRoot.innerHTML = style + template;
        
        // 缓存 DOM 引用，避免重复查询提高性能
        this._elements = {
            container: this.shadowRoot.querySelector('.scroll-container'),       // 滚动容器
            sentinel: this.shadowRoot.querySelector('.sentinel'),                 // 哨兵元素，用于 IntersectionObserver
            loadingContainer: this.shadowRoot.querySelector('.loading-container'), // 加载中容器
            endContainer: this.shadowRoot.querySelector('.end-container'),         // 加载完成容器
            errorContainer: this.shadowRoot.querySelector('.error-container')      // 错误状态容器
        };
    }
    
    /**
     * 设置滚动检测方式
     * 根据配置启用 IntersectionObserver 和/或滚动事件监听
     * @private
     */
    _setupDetection() {
        // 先清理旧的监听器
        this._cleanup();
        
        // 如果支持且启用了 IntersectionObserver，则设置它
        if (this._useObserver && 'IntersectionObserver' in window) {
            this._setupIntersectionObserver();
        }
        
        // 如果启用了滚动监听，则设置滚动事件
        if (this._useScroll) {
            this._setupScrollListener();
        }
    }
    
    /**
     * 设置 IntersectionObserver 监听哨兵元素
     * 当哨兵元素进入视口时触发加载
     * @private
     */
    _setupIntersectionObserver() {
        const options = {
            root: this._elements.container,                      // 观察的根元素
            rootMargin: `0px 0px ${this._threshold}px 0px`,     // 底部边距，提前触发
            threshold: 0.1                                       // 触发阈值，10% 可见时触发
        };
        
        // 创建观察器
        this._observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // 当哨兵元素可见，且没有正在加载，且还有更多数据时触发加载
                if (entry.isIntersecting && !this._isLoading && this._hasMore) {
                    this._triggerLoad();
                }
            });
        }, options);
        
        // 开始观察哨兵元素
        this._observer.observe(this._elements.sentinel);
    }
    
    /**
     * 更新 Observer 配置
     * 当 threshold 改变时需要重新创建 observer
     * @private
     */
    _updateObserver() {
        if (this._observer) {
            this._observer.disconnect();           // 断开旧的观察器
            this._setupIntersectionObserver();     // 创建新的观察器
        }
    }
    
    /**
     * 设置滚动事件监听
     * 使用节流优化性能
     * @private
     */
    _setupScrollListener() {
        // 使用节流函数包装滚动检查，避免频繁触发
        this._scrollHandler = this._throttle(() => {
            this._checkScrollPosition();
        }, this._throttleDelay);
        
        // 添加滚动监听，使用 passive 优化滚动性能
        this._elements.container.addEventListener('scroll', this._scrollHandler, { passive: true });
    }
    
    /**
     * 检查滚动位置
     * 计算距离底部的距离，判断是否需要加载更多
     * @private
     */
    _checkScrollPosition() {
        const { scrollTop, scrollHeight, clientHeight } = this._elements.container;
        // 计算滚动条距离底部的距离
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        
        // 如果距离底部小于阈值，且没有正在加载，且还有更多数据，则触发加载
        if (distanceToBottom <= this._threshold && !this._isLoading && this._hasMore) {
            this._triggerLoad();
        }
    }
    
    /**
     * 触发加载事件
     * 派发自定义的 'load' 事件给外部监听
     * @private
     */
    _triggerLoad() {
        const event = new CustomEvent('load', {
            detail: { 
                timestamp: Date.now()  // 传递时间戳信息
            },
            bubbles: true,    // 事件可以冒泡
            composed: true    // 事件可以穿透 Shadow DOM
        });
        
        this.dispatchEvent(event);
    }
    
    /**
     * 更新加载状态的 UI 显示
     * 控制加载中容器和哨兵元素的显示/隐藏
     * @private
     */
    _updateLoadingState() {
        if (this._isLoading) {
            // 显示加载中状态
            this._elements.loadingContainer.classList.remove('hidden');
            // 隐藏哨兵元素，避免重复触发
            this._elements.sentinel.style.display = 'none';
        } else {
            // 隐藏加载中状态
            this._elements.loadingContainer.classList.add('hidden');
            // 如果还有更多数据，显示哨兵元素
            this._elements.sentinel.style.display = this._hasMore ? 'block' : 'none';
        }
    }
    
    /**
     * 更新结束状态的 UI 显示
     * 控制"没有更多"提示和哨兵元素的显示/隐藏
     * @private
     */
    _updateEndState() {
        if (!this._hasMore) {
            // 显示"没有更多"提示
            this._elements.endContainer.classList.remove('hidden');
            // 隐藏哨兵元素
            this._elements.sentinel.style.display = 'none';
        } else {
            // 隐藏"没有更多"提示
            this._elements.endContainer.classList.add('hidden');
            // 如果不在加载中，显示哨兵元素
            this._elements.sentinel.style.display = !this._isLoading ? 'block' : 'none';
        }
    }
    
    /**
     * 显示错误状态
     * 公共方法，供外部调用显示错误提示
     * @public
     */
    showError() {
        this._elements.errorContainer.classList.remove('hidden');  // 显示错误容器
        this._elements.loadingContainer.classList.add('hidden');   // 隐藏加载中状态
        this._elements.sentinel.style.display = 'none';            // 隐藏哨兵元素
    }
    
    /**
     * 隐藏错误状态
     * 公共方法，供外部调用隐藏错误提示并恢复正常状态
     * @public
     */
    hideError() {
        this._elements.errorContainer.classList.add('hidden');  // 隐藏错误容器
        this._updateLoadingState();  // 恢复加载状态显示
        this._updateEndState();      // 恢复结束状态显示
    }
    
    /**
     * 节流函数
     * 限制函数执行频率，优化性能
     * 
     * 实现原理：
     * - 如果距离上次执行超过 delay，立即执行
     * - 否则延迟执行，确保在 delay 时间后执行
     * 
     * @param {Function} func - 要节流的函数
     * @param {number} delay - 节流延迟时间（毫秒）
     * @returns {Function} 节流后的函数
     * @private
     */
    _throttle(func, delay) {
        let timeoutId;           // 定时器 ID
        let lastExecTime = 0;    // 上次执行时间
        
        return (...args) => {
            const currentTime = Date.now();
            
            // 如果距离上次执行时间超过 delay，立即执行
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                // 否则清除之前的定时器，设置新的定时器
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    /**
     * 清理资源
     * 移除所有事件监听器和观察器，防止内存泄漏
     * @private
     */
    _cleanup() {
        // 断开 IntersectionObserver
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
        
        // 移除滚动事件监听器
        if (this._scrollHandler) {
            this._elements.container.removeEventListener('scroll', this._scrollHandler);
            this._scrollHandler = null;
        }
    }
    
    /**
     * 重置组件状态
     * 公共方法，恢复组件到初始状态
     * @public
     */
    reset() {
        this._isLoading = false;                      // 重置加载状态
        this._hasMore = true;                         // 重置数据状态
        this.removeAttribute('loading');              // 移除 loading 属性
        this.setAttribute('has-more', 'true');        // 设置 has-more 属性
        this.hideError();                             // 隐藏错误提示
        this._setupDetection();                       // 重新设置检测
    }
    
    /**
     * 滚动到顶部
     * 公共方法，快速回到顶部
     * @public
     */
    scrollToTop() {
        this._elements.container.scrollTop = 0;
    }
    
    /**
     * 获取 threshold 属性
     * @returns {number} 距离底部的阈值（像素）
     */
    get threshold() {
        return this._threshold;
    }
    
    /**
     * 设置 threshold 属性
     * @param {number} value - 距离底部的阈值（像素）
     */
    set threshold(value) {
        this.setAttribute('threshold', value);
    }
    
    /**
     * 获取 loading 状态
     * @returns {boolean} 是否正在加载
     */
    get loading() {
        return this._isLoading;
    }
    
    /**
     * 设置 loading 状态
     * @param {boolean} value - 是否正在加载
     */
    set loading(value) {
        this.setAttribute('loading', value);
    }
    
    /**
     * 获取 hasMore 状态
     * @returns {boolean} 是否还有更多数据
     */
    get hasMore() {
        return this._hasMore;
    }
    
    /**
     * 设置 hasMore 状态
     * @param {boolean} value - 是否还有更多数据
     */
    set hasMore(value) {
        this.setAttribute('has-more', value);
    }
}

/**
 * 注册自定义元素
 * 将 InfiniteScroll 类注册为 'infinite-scroll' 标签
 */
customElements.define('infinite-scroll', InfiniteScroll);
