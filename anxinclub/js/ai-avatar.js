/**
 * 安心成长社 - AI虚拟引导员卡通漂浮形象
 * 功能：软萌治愈系卡通人物，悬浮定位，防遮挡交互，呼吸漂浮动画
 * 作者：资深前端开发工程师
 * 版本：v1.0
 */

class AIAvatar {
    constructor(options = {}) {
        this.options = {
            position: options.position || 'right', // 'left' | 'right'
            initialPersonality: options.initialPersonality || 'gentle', // gentle | energetic | calm | relaxed
            onClick: options.onClick || (() => {}),
            ...options
        };

        this.isMinimized = false;
        this.isDragging = false;
        this.currentPersonality = this.options.initialPersonality;
        this.personalities = {
            gentle: {
                name: '温柔亲子陪伴型',
                color: '#F5C6C6',
                secondaryColor: '#FFE4E1',
                icon: '👩‍👧',
                description: '共情力强、温柔耐心'
            },
            energetic: {
                name: '活力正念引导型',
                color: '#8FB9A8',
                secondaryColor: '#E8F5E9',
                icon: '🧘‍♀️',
                description: '积极有活力、正向鼓励'
            },
            calm: {
                name: '沉静成长教练型',
                color: '#D4B896',
                secondaryColor: '#F5F1E9',
                icon: '📚',
                description: '沉稳理性、共情包容'
            },
            relaxed: {
                name: '松弛通透陪伴型',
                color: '#B8D4E3',
                secondaryColor: '#E3F2FD',
                icon: '🌸',
                description: '温润舒缓、无压迫感'
            }
        };

        this.container = null;
        this.avatarElement = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.createAvatar();
        this.bindEvents();
        this.addStyles();
        this.loadUserPreference();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'ai-avatar-container';
        this.container.className = 'ai-avatar-container';
        document.body.appendChild(this.container);
    }

    createAvatar() {
        const personality = this.personalities[this.currentPersonality];
        
        this.avatarElement = document.createElement('div');
        this.avatarElement.className = 'ai-avatar';
        this.avatarElement.innerHTML = `
            <div class="ai-avatar-inner">
                <div class="ai-avatar-body">
                    <div class="ai-avatar-face">
                        <div class="ai-avatar-eyes">
                            <span class="eye left"></span>
                            <span class="eye right"></span>
                        </div>
                        <div class="ai-avatar-mouth"></div>
                        <div class="ai-avatar-blush left"></div>
                        <div class="ai-avatar-blush right"></div>
                    </div>
                    <div class="ai-avatar-hair"></div>
                    <div class="ai-avatar-accessories">
                        <span class="accessory-icon">${personality.icon}</span>
                    </div>
                </div>
                <div class="ai-avatar-glow"></div>
            </div>
            <div class="ai-avatar-tooltip">
                <span class="tooltip-text">点击与我聊天</span>
            </div>
            <button class="ai-avatar-minimize" title="最小化">
                <i class="fa fa-minus"></i>
            </button>
            <div class="ai-avatar-personality-indicator" style="background: ${personality.color}"></div>
        `;

        this.container.appendChild(this.avatarElement);
    }

    addStyles() {
        if (document.getElementById('ai-avatar-styles')) return;

        const style = document.createElement('style');
        style.id = 'ai-avatar-styles';
        style.textContent = `
            /* AI Avatar Container */
            .ai-avatar-container {
                position: fixed;
                bottom: 100px;
                right: 20px;
                z-index: 99;
                pointer-events: none;
            }

            .ai-avatar-container.left {
                right: auto;
                left: 20px;
            }

            /* AI Avatar Main */
            .ai-avatar {
                position: relative;
                width: 80px;
                height: 80px;
                cursor: pointer;
                pointer-events: auto;
                transition: all 0.3s ease;
                animation: breathe 3s ease-in-out infinite;
            }

            @keyframes breathe {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-5px) scale(1.02); }
            }

            /* Avatar Inner */
            .ai-avatar-inner {
                position: relative;
                width: 100%;
                height: 100%;
                opacity: 0.7;
                transition: opacity 0.2s ease-in-out;
            }

            .ai-avatar:hover .ai-avatar-inner,
            .ai-avatar.active .ai-avatar-inner {
                opacity: 1;
            }

            /* Avatar Body */
            .ai-avatar-body {
                position: relative;
                width: 60px;
                height: 60px;
                margin: 10px;
                background: linear-gradient(135deg, #FFE4E1 0%, #FFF0F5 100%);
                border-radius: 50%;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            /* Face */
            .ai-avatar-face {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
            }

            /* Eyes */
            .ai-avatar-eyes {
                position: absolute;
                top: 12px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 12px;
            }

            .ai-avatar-eyes .eye {
                width: 6px;
                height: 6px;
                background: #333;
                border-radius: 50%;
                animation: blink 4s infinite;
            }

            @keyframes blink {
                0%, 96%, 100% { transform: scaleY(1); }
                98% { transform: scaleY(0.1); }
            }

            /* Mouth */
            .ai-avatar-mouth {
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                width: 12px;
                height: 6px;
                border: 2px solid #FF9999;
                border-top: none;
                border-radius: 0 0 12px 12px;
            }

            /* Blush */
            .ai-avatar-blush {
                position: absolute;
                top: 18px;
                width: 8px;
                height: 5px;
                background: rgba(255, 153, 153, 0.4);
                border-radius: 50%;
            }

            .ai-avatar-blush.left { left: 2px; }
            .ai-avatar-blush.right { right: 2px; }

            /* Hair */
            .ai-avatar-hair {
                position: absolute;
                top: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 50px;
                height: 25px;
                background: linear-gradient(135deg, #D4B896 0%, #C4A484 100%);
                border-radius: 25px 25px 0 0;
            }

            /* Accessories */
            .ai-avatar-accessories {
                position: absolute;
                top: -8px;
                right: -5px;
                font-size: 16px;
                animation: float 2s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }

            /* Glow Effect */
            .ai-avatar-glow {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 70px;
                height: 70px;
                background: radial-gradient(circle, rgba(143, 185, 168, 0.2) 0%, transparent 70%);
                border-radius: 50%;
                animation: pulse-glow 3s ease-in-out infinite;
                pointer-events: none;
            }

            @keyframes pulse-glow {
                0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
            }

            /* Tooltip */
            .ai-avatar-tooltip {
                position: absolute;
                bottom: 90px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                pointer-events: none;
            }

            .ai-avatar-tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 5px solid transparent;
                border-top-color: rgba(0, 0, 0, 0.8);
            }

            .ai-avatar:hover .ai-avatar-tooltip {
                opacity: 1;
                visibility: visible;
            }

            /* Minimize Button */
            .ai-avatar-minimize {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 20px;
                height: 20px;
                background: #E8DDD0;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: #666;
                opacity: 0;
                transition: all 0.3s ease;
            }

            .ai-avatar:hover .ai-avatar-minimize {
                opacity: 1;
            }

            .ai-avatar-minimize:hover {
                background: #D4B896;
                color: white;
            }

            /* Personality Indicator */
            .ai-avatar-personality-indicator {
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 8px;
                height: 8px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }

            /* Minimized State */
            .ai-avatar.minimized {
                width: 44px;
                height: 44px;
            }

            .ai-avatar.minimized .ai-avatar-body {
                width: 36px;
                height: 36px;
                margin: 4px;
            }

            .ai-avatar.minimized .ai-avatar-face {
                width: 24px;
                height: 24px;
            }

            .ai-avatar.minimized .ai-avatar-eyes {
                top: 8px;
                gap: 8px;
            }

            .ai-avatar.minimized .ai-avatar-eyes .eye {
                width: 4px;
                height: 4px;
            }

            .ai-avatar.minimized .ai-avatar-mouth {
                width: 8px;
                height: 4px;
                border-width: 1.5px;
            }

            .ai-avatar.minimized .ai-avatar-blush {
                width: 5px;
                height: 3px;
                top: 12px;
            }

            .ai-avatar.minimized .ai-avatar-hair {
                width: 30px;
                height: 15px;
            }

            .ai-avatar.minimized .ai-avatar-accessories {
                font-size: 10px;
                top: -5px;
                right: -3px;
            }

            .ai-avatar.minimized .ai-avatar-glow {
                width: 40px;
                height: 40px;
            }

            .ai-avatar.minimized .ai-avatar-minimize {
                opacity: 1;
            }

            /* Dragging State */
            .ai-avatar.dragging {
                animation: none;
                cursor: grabbing;
            }

            .ai-avatar.dragging .ai-avatar-inner {
                opacity: 1;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .ai-avatar-container {
                    bottom: 80px;
                    right: 10px;
                }

                .ai-avatar {
                    width: 60px;
                    height: 60px;
                }

                .ai-avatar-body {
                    width: 48px;
                    height: 48px;
                    margin: 6px;
                }

                .ai-avatar-face {
                    width: 32px;
                    height: 32px;
                }

                .ai-avatar-eyes {
                    top: 10px;
                    gap: 10px;
                }

                .ai-avatar-eyes .eye {
                    width: 5px;
                    height: 5px;
                }

                .ai-avatar-mouth {
                    width: 10px;
                    height: 5px;
                    border-width: 1.5px;
                }

                .ai-avatar-blush {
                    width: 6px;
                    height: 4px;
                    top: 14px;
                }

                .ai-avatar-hair {
                    width: 40px;
                    height: 20px;
                }

                .ai-avatar-accessories {
                    font-size: 14px;
                }

                .ai-avatar-glow {
                    width: 56px;
                    height: 56px;
                }

                .ai-avatar.minimized {
                    width: 44px;
                    height: 44px;
                }
            }

            /* Talking Animation */
            .ai-avatar.talking .ai-avatar-mouth {
                animation: talk 0.3s ease-in-out infinite alternate;
            }

            @keyframes talk {
                from { height: 3px; border-radius: 0 0 6px 6px; }
                to { height: 8px; border-radius: 0 0 12px 12px; }
            }

            /* Happy Animation */
            .ai-avatar.happy .ai-avatar-mouth {
                width: 16px;
                height: 8px;
                background: #FF9999;
                border: none;
                border-radius: 0 0 16px 16px;
            }

            .ai-avatar.happy .ai-avatar-eyes .eye {
                transform: scaleY(0.3);
            }
        `;

        document.head.appendChild(style);
    }

    bindEvents() {
        let startX, startY, initialX, initialY;

        // 点击事件
        this.avatarElement.addEventListener('click', (e) => {
            if (!this.isDragging) {
                this.options.onClick();
            }
        });

        // 最小化按钮
        const minimizeBtn = this.avatarElement.querySelector('.ai-avatar-minimize');
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMinimize();
        });

        // 拖拽功能
        this.avatarElement.addEventListener('mousedown', (e) => {
            if (e.target === minimizeBtn || e.target.closest('.ai-avatar-minimize')) return;
            
            this.isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = this.avatarElement.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                this.isDragging = true;
                this.avatarElement.classList.add('dragging');
            }

            if (this.isDragging) {
                const newX = initialX + dx;
                const newY = initialY + dy;

                // 限制在视口内
                const maxX = window.innerWidth - this.avatarElement.offsetWidth;
                const maxY = window.innerHeight - this.avatarElement.offsetHeight;

                const clampedX = Math.max(0, Math.min(newX, maxX));
                const clampedY = Math.max(0, Math.min(newY, maxY));

                this.avatarElement.style.position = 'fixed';
                this.avatarElement.style.left = clampedX + 'px';
                this.avatarElement.style.right = 'auto';
                this.avatarElement.style.top = clampedY + 'px';
                this.avatarElement.style.bottom = 'auto';
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            if (this.isDragging) {
                this.avatarElement.classList.remove('dragging');
                
                // 吸附到边缘
                const rect = this.avatarElement.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const viewportCenterX = window.innerWidth / 2;

                if (centerX < viewportCenterX) {
                    // 吸附到左边
                    this.avatarElement.style.left = '20px';
                    this.container.classList.add('left');
                } else {
                    // 吸附到右边
                    this.avatarElement.style.left = 'auto';
                    this.avatarElement.style.right = '20px';
                    this.container.classList.remove('left');
                }

                // 保存位置偏好
                this.savePositionPreference(centerX < viewportCenterX ? 'left' : 'right');
            }

            setTimeout(() => {
                this.isDragging = false;
            }, 100);
        };

        // 触摸事件支持（移动端）
        this.avatarElement.addEventListener('touchstart', (e) => {
            if (e.target === minimizeBtn || e.target.closest('.ai-avatar-minimize')) return;
            
            const touch = e.touches[0];
            this.isDragging = false;
            startX = touch.clientX;
            startY = touch.clientY;
            
            const rect = this.avatarElement.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
        }, { passive: true });

        this.avatarElement.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                this.isDragging = true;
                this.avatarElement.classList.add('dragging');
                e.preventDefault();
            }

            if (this.isDragging) {
                const newX = initialX + dx;
                const newY = initialY + dy;

                const maxX = window.innerWidth - this.avatarElement.offsetWidth;
                const maxY = window.innerHeight - this.avatarElement.offsetHeight;

                const clampedX = Math.max(0, Math.min(newX, maxX));
                const clampedY = Math.max(0, Math.min(newY, maxY));

                this.avatarElement.style.position = 'fixed';
                this.avatarElement.style.left = clampedX + 'px';
                this.avatarElement.style.right = 'auto';
                this.avatarElement.style.top = clampedY + 'px';
                this.avatarElement.style.bottom = 'auto';
            }
        }, { passive: false });

        this.avatarElement.addEventListener('touchend', () => {
            if (this.isDragging) {
                this.avatarElement.classList.remove('dragging');
                
                const rect = this.avatarElement.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const viewportCenterX = window.innerWidth / 2;

                if (centerX < viewportCenterX) {
                    this.avatarElement.style.left = '20px';
                    this.container.classList.add('left');
                } else {
                    this.avatarElement.style.left = 'auto';
                    this.avatarElement.style.right = '20px';
                    this.container.classList.remove('left');
                }

                this.savePositionPreference(centerX < viewportCenterX ? 'left' : 'right');
            }

            setTimeout(() => {
                this.isDragging = false;
            }, 100);
        });
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.avatarElement.classList.toggle('minimized', this.isMinimized);
        
        // 保存状态
        localStorage.setItem('aiAvatarMinimized', this.isMinimized);
    }

    setPersonality(personalityKey) {
        if (!this.personalities[personalityKey]) return;

        this.currentPersonality = personalityKey;
        const personality = this.personalities[personalityKey];

        // 更新外观
        const indicator = this.avatarElement.querySelector('.ai-avatar-personality-indicator');
        const icon = this.avatarElement.querySelector('.accessory-icon');
        
        if (indicator) {
            indicator.style.background = personality.color;
        }
        if (icon) {
            icon.textContent = personality.icon;
        }

        // 保存偏好
        localStorage.setItem('aiAvatarPersonality', personalityKey);
    }

    getCurrentPersonality() {
        return {
            key: this.currentPersonality,
            ...this.personalities[this.currentPersonality]
        };
    }

    showTalking() {
        this.avatarElement.classList.add('talking');
    }

    hideTalking() {
        this.avatarElement.classList.remove('talking');
    }

    showHappy() {
        this.avatarElement.classList.add('happy');
        setTimeout(() => {
            this.avatarElement.classList.remove('happy');
        }, 2000);
    }

    savePositionPreference(position) {
        localStorage.setItem('aiAvatarPosition', position);
    }

    loadUserPreference() {
        // 加载最小化状态
        const minimized = localStorage.getItem('aiAvatarMinimized');
        if (minimized === 'true') {
            this.isMinimized = true;
            this.avatarElement.classList.add('minimized');
        }

        // 加载位置偏好
        const position = localStorage.getItem('aiAvatarPosition');
        if (position === 'left') {
            this.container.classList.add('left');
        }

        // 加载人格偏好
        const personality = localStorage.getItem('aiAvatarPersonality');
        if (personality && this.personalities[personality]) {
            this.setPersonality(personality);
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAvatar;
}

if (typeof window !== 'undefined') {
    window.AIAvatar = AIAvatar;
}