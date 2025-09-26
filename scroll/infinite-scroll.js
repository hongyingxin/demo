/**
 * InfiniteScroll Web Component
 * 一个纯粹的无限滚动检测组件，只负责检测滚动和触发事件
 */
class InfiniteScroll extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // 内部状态
        this._observer = null;
        this._scrollHandler = null;
        this._isLoading = false;
        this._hasMore = true;
        
        // 配置
        this._threshold = 0;
        this._useObserver = true;
        this._useScroll = true;
        this._throttleDelay = 200;
    }
    
    // 组件属性
    static get observedAttributes() {
        return ['threshold', 'use-observer', 'use-scroll', 'loading', 'has-more'];
    }
    
    // 属性变化回调
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'threshold':
                this._threshold = parseInt(newValue) || 0;
                this._updateObserver();
                break;
            case 'use-observer':
                this._useObserver = newValue !== 'false';
                this._setupDetection();
                break;
            case 'use-scroll':
                this._useScroll = newValue !== 'false';
                this._setupDetection();
                break;
            case 'loading':
                this._isLoading = newValue === 'true';
                this._updateLoadingState();
                break;
            case 'has-more':
                this._hasMore = newValue !== 'false';
                this._updateEndState();
                break;
        }
    }
    
    // 组件连接到DOM
    connectedCallback() {
        this._render();
        this._setupDetection();
    }
    
    // 组件从DOM断开
    disconnectedCallback() {
        this._cleanup();
    }
    
    // 渲染组件
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
        
        // 缓存DOM引用
        this._elements = {
            container: this.shadowRoot.querySelector('.scroll-container'),
            sentinel: this.shadowRoot.querySelector('.sentinel'),
            loadingContainer: this.shadowRoot.querySelector('.loading-container'),
            endContainer: this.shadowRoot.querySelector('.end-container'),
            errorContainer: this.shadowRoot.querySelector('.error-container')
        };
    }
    
    // 设置检测方式
    _setupDetection() {
        this._cleanup();
        
        if (this._useObserver && 'IntersectionObserver' in window) {
            this._setupIntersectionObserver();
        }
        
        if (this._useScroll) {
            this._setupScrollListener();
        }
    }
    
    // 设置 IntersectionObserver
    _setupIntersectionObserver() {
        const options = {
            root: this._elements.container,
            rootMargin: `0px 0px ${this._threshold}px 0px`,
            threshold: 0.1
        };
        
        this._observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this._isLoading && this._hasMore) {
                    this._triggerLoad();
                }
            });
        }, options);
        
        this._observer.observe(this._elements.sentinel);
    }
    
    // 更新 Observer 配置
    _updateObserver() {
        if (this._observer) {
            this._observer.disconnect();
            this._setupIntersectionObserver();
        }
    }
    
    // 设置滚动监听
    _setupScrollListener() {
        this._scrollHandler = this._throttle(() => {
            this._checkScrollPosition();
        }, this._throttleDelay);
        
        this._elements.container.addEventListener('scroll', this._scrollHandler, { passive: true });
    }
    
    // 检查滚动位置
    _checkScrollPosition() {
        const { scrollTop, scrollHeight, clientHeight } = this._elements.container;
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        
        if (distanceToBottom <= this._threshold && !this._isLoading && this._hasMore) {
            this._triggerLoad();
        }
    }
    
    // 触发加载事件
    _triggerLoad() {
        const event = new CustomEvent('load', {
            detail: { 
                timestamp: Date.now() 
            },
            bubbles: true,
            composed: true
        });
        
        this.dispatchEvent(event);
    }
    
    // 更新加载状态
    _updateLoadingState() {
        if (this._isLoading) {
            this._elements.loadingContainer.classList.remove('hidden');
            this._elements.sentinel.style.display = 'none';
        } else {
            this._elements.loadingContainer.classList.add('hidden');
            this._elements.sentinel.style.display = this._hasMore ? 'block' : 'none';
        }
    }
    
    // 更新结束状态
    _updateEndState() {
        if (!this._hasMore) {
            this._elements.endContainer.classList.remove('hidden');
            this._elements.sentinel.style.display = 'none';
        } else {
            this._elements.endContainer.classList.add('hidden');
            this._elements.sentinel.style.display = !this._isLoading ? 'block' : 'none';
        }
    }
    
    // 显示错误状态
    showError() {
        this._elements.errorContainer.classList.remove('hidden');
        this._elements.loadingContainer.classList.add('hidden');
        this._elements.sentinel.style.display = 'none';
    }
    
    // 隐藏错误状态
    hideError() {
        this._elements.errorContainer.classList.add('hidden');
        this._updateLoadingState();
        this._updateEndState();
    }
    
    // 节流函数
    _throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return (...args) => {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    // 清理资源
    _cleanup() {
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
        
        if (this._scrollHandler) {
            this._elements.container.removeEventListener('scroll', this._scrollHandler);
            this._scrollHandler = null;
        }
    }
    
    // 公共方法：重置组件
    reset() {
        this._isLoading = false;
        this._hasMore = true;
        this.removeAttribute('loading');
        this.setAttribute('has-more', 'true');
        this.hideError();
        this._setupDetection();
    }
    
    // 公共方法：滚动到顶部
    scrollToTop() {
        this._elements.container.scrollTop = 0;
    }
    
    // 获取和设置属性的便捷方法
    get threshold() {
        return this._threshold;
    }
    
    set threshold(value) {
        this.setAttribute('threshold', value);
    }
    
    get loading() {
        return this._isLoading;
    }
    
    set loading(value) {
        this.setAttribute('loading', value);
    }
    
    get hasMore() {
        return this._hasMore;
    }
    
    set hasMore(value) {
        this.setAttribute('has-more', value);
    }
}

// 注册自定义元素
customElements.define('infinite-scroll', InfiniteScroll);
