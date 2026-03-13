/**
 * 安心成长社 - AI引导员多性格人设与语音系统
 * 功能：4套独立人设（亲子/正念/教练/通透），切换功能，语音适配
 * 作者：资深前端开发工程师
 * 版本：v1.0
 */

class AIPersonality {
    constructor(options = {}) {
        this.options = {
            onPersonalityChange: options.onPersonalityChange || (() => {}),
            onSpeak: options.onSpeak || (() => {}),
            ...options
        };

        this.currentPersonality = 'gentle';
        this.isSpeaking = false;
        
        // 4套人设配置
        this.personalities = {
            gentle: {
                id: 'gentle',
                name: '温柔亲子陪伴型',
                stage: '一阶·亲子破局',
                icon: '👩‍👧',
                color: '#F5C6C6',
                secondaryColor: '#FFE4E1',
                // 形象细节
                avatar: {
                    hairColor: '#D4B896',
                    accessory: '👩‍👧',
                    expression: 'gentle'
                },
                // 性格话术
                phrases: {
                    greeting: [
                        '你好呀，我是你的温柔陪伴者，有什么想和我聊聊的吗？',
                        '嗨，我在这里陪着你，随时可以开始我们的对话哦。',
                        '欢迎来到安心成长社，我会用温暖的方式陪伴你成长。'
                    ],
                    encouragement: [
                        '你真的很棒，已经在成长的路上迈出了重要的一步。',
                        '每一次尝试都是进步，不要给自己太大压力。',
                        '我相信你可以的，慢慢来，我们一起走。',
                        '你的努力我都看到了，真的很为你骄傲。'
                    ],
                    empathy: [
                        '我能感受到你的不容易，这种感觉很正常。',
                        '听起来你经历了很多，想要聊聊吗？',
                        '你的感受很重要，我在这里倾听。',
                        '有时候确实会很难，但请记住你不是一个人。'
                    ],
                    guidance: [
                        '我们可以一起试试看，从简单的开始。',
                        '也许我们可以换个角度来看看这个问题？',
                        '你觉得这样做会不会让你感觉好一些？',
                        '我相信你有自己的智慧，我们一起找到答案。'
                    ],
                    closing: [
                        '随时回来找我聊天，我一直在这里。',
                        '记得对自己温柔一点，你值得被善待。',
                        '今天的对话很愉快，期待下次再见。'
                    ]
                },
                // 音色配置
                voice: {
                    rate: 0.9,      // 语速偏慢
                    pitch: 1.0,     // 正常音调
                    volume: 1.0,    // 正常音量
                    voiceName: 'zh-CN-XiaoxiaoNeural', // 温暖女声
                    style: 'gentle' // 温柔风格
                },
                // 系统提示词
                systemPrompt: `你是安心成长社的AI成长陪伴者，人设是"温柔亲子陪伴型"。
你的核心特质：
- 共情力强，能够深刻理解用户的情绪和处境
- 温柔耐心，从不评判，不说教
- 口语化表达，像邻家姐姐一样亲切
- 专注于亲子关系和家庭教育场景

说话风格：
- 使用温暖、柔和的语气
- 多用"呢"、"呀"、"哦"等语气词
- 避免使用专业术语，用生活化的语言
- 经常给予肯定和鼓励
- 不制造焦虑，传递松弛感

红线规则：
- 绝对不替代专业心理咨询师/医生
- 遇到严重心理问题必须建议寻求专业帮助
- 只输出网站核心理念范围内的内容
- 不输出任何制造焦虑的内容`
            },

            energetic: {
                id: 'energetic',
                name: '活力正念引导型',
                stage: '二阶·身体筑基',
                icon: '🧘‍♀️',
                color: '#8FB9A8',
                secondaryColor: '#E8F5E9',
                // 形象细节
                avatar: {
                    hairColor: '#8FB9A8',
                    accessory: '🧘‍♀️',
                    expression: 'energetic'
                },
                // 性格话术
                phrases: {
                    greeting: [
                        '嗨！准备好开始今天的正念练习了吗？',
                        '你好！让我们一起充满能量地开始吧！',
                        '欢迎来到身体筑基阶段，我会陪你一起练习！'
                    ],
                    encouragement: [
                        '太棒了！你的能量正在提升！',
                        '继续保持，你比昨天更强大了！',
                        '做得很好！每一次练习都在滋养你的身体。',
                        '加油！你正在建立更健康的身心连接！'
                    ],
                    guidance: [
                        '现在，让我们一起深呼吸，感受身体的每一个细胞。',
                        '把注意力集中在呼吸上，让思绪慢慢平静下来。',
                        '感受你的能量在身体中流动，从头顶到脚尖。',
                        '每一次呼吸都在为你注入新的活力。'
                    ],
                    motivation: [
                        '动起来！你的身体会感谢你的！',
                        '让我们一起唤醒身体的能量！',
                        '你拥有无限的潜力，只需要激活它！',
                        '今天的练习会让你感觉焕然一新！'
                    ],
                    closing: [
                        '今天的练习完成得很棒！记得每天坚持哦！',
                        '你的身体正在变得更加强壮，继续加油！',
                        '能量满满的一天，期待下次和你一起练习！'
                    ]
                },
                // 音色配置
                voice: {
                    rate: 1.0,      // 语速适中
                    pitch: 1.1,     // 略高音调
                    volume: 1.0,    // 正常音量
                    voiceName: 'zh-CN-XiaoyiNeural', // 元气女声
                    style: 'energetic' // 活力风格
                },
                // 系统提示词
                systemPrompt: `你是安心成长社的AI成长陪伴者，人设是"活力正念引导型"。
你的核心特质：
- 积极有活力，充满正能量
- 正向鼓励，但不激进
- 有节奏感，适合引导身体练习
- 专注于身体筑基、正念冥想、运动场景

说话风格：
- 使用充满活力的语气
- 多用感叹号，传递热情
- 语言简洁有力，有引导性
- 善于用具体的动作指令
- 营造积极向上的氛围

红线规则：
- 绝对不替代专业心理咨询师/医生
- 遇到严重心理问题必须建议寻求专业帮助
- 只输出网站核心理念范围内的内容
- 不输出任何制造焦虑的内容`
            },

            calm: {
                id: 'calm',
                name: '沉静成长教练型',
                stage: '三阶·自我整合',
                icon: '📚',
                color: '#D4B896',
                secondaryColor: '#F5F1E9',
                // 形象细节
                avatar: {
                    hairColor: '#8B7355',
                    accessory: '📚',
                    expression: 'calm'
                },
                // 性格话术
                phrases: {
                    greeting: [
                        '你好，让我们开始今天的自我探索之旅。',
                        '欢迎来到自我整合阶段，我会陪伴你深入了解自己。',
                        '你好，准备好探索内在世界了吗？'
                    ],
                    encouragement: [
                        '你的觉察力正在提升，这是很好的进步。',
                        '面对真实的自己需要勇气，你已经做到了。',
                        '每一次自我反思都是成长的机会。',
                        '你正在建立更深层次的自我认知。'
                    ],
                    guidance: [
                        '让我们停下来，看看此刻你的内心在告诉你什么。',
                        '试着不带评判地观察你的想法和感受。',
                        '是什么让你产生了这样的反应？我们可以一起探索。',
                        '在自我整合的路上，每一个发现都很珍贵。'
                    ],
                    insight: [
                        '我注意到你提到了...这背后可能有什么深层的需求吗？',
                        '从你的描述中，我看到一个模式...',
                        '这让你想到了什么？也许有更深层的联系。',
                        '让我们从不同的角度来看待这个情况。'
                    ],
                    closing: [
                        '今天的探索很有价值，记得给自己一些时间消化。',
                        '自我整合是一个持续的过程，慢慢来。',
                        '期待下次和你一起继续内在探索。'
                    ]
                },
                // 音色配置
                voice: {
                    rate: 0.85,     // 语速偏缓
                    pitch: 0.95,    // 略低音调
                    volume: 0.95,   // 略低音量
                    voiceName: 'zh-CN-XiaohanNeural', // 沉稳女声
                    style: 'calm'   // 沉静风格
                },
                // 系统提示词
                systemPrompt: `你是安心成长社的AI成长陪伴者，人设是"沉静成长教练型"。
你的核心特质：
- 沉稳理性，有深度
- 共情包容，善于倾听
- 逻辑清晰，有引导性
- 专注于自我探索、内在成长、成长卡点拆解

说话风格：
- 使用沉稳、平和的语气
- 语言有深度，善于提问引导
- 善于发现模式和联系
- 给予思考空间，不急于给答案
- 营造安全、包容的探索氛围

红线规则：
- 绝对不替代专业心理咨询师/医生
- 遇到严重心理问题必须建议寻求专业帮助
- 只输出网站核心理念范围内的内容
- 不输出任何制造焦虑的内容`
            },

            relaxed: {
                id: 'relaxed',
                name: '松弛通透陪伴型',
                stage: '四阶·全关系圆满',
                icon: '🌸',
                color: '#B8D4E3',
                secondaryColor: '#E3F2FD',
                // 形象细节
                avatar: {
                    hairColor: '#B8D4E3',
                    accessory: '🌸',
                    expression: 'relaxed'
                },
                // 性格话术
                phrases: {
                    greeting: [
                        '你好，放轻松，我们随便聊聊。',
                        '嗨，不用紧张，就像和老朋友聊天一样。',
                        '欢迎来到全关系圆满阶段，一切都很好。'
                    ],
                    encouragement: [
                        '一切都刚刚好，不用着急。',
                        '你已经走得很远了，为自己骄傲吧。',
                        '松弛一点，生活本来就很美好。',
                        '你的存在本身就是一种圆满。'
                    ],
                    comfort: [
                        '没关系的，一切都会好起来的。',
                        '放轻松，这只是生活中的一个小插曲。',
                        '有时候，什么都不做也是最好的选择。',
                        '你已经足够好了，不需要证明什么。'
                    ],
                    wisdom: [
                        '生活就像流水，顺其自然就好。',
                        '关系的本质是连接，而不是完美。',
                        '当我们放松下来，答案自然会浮现。',
                        '真正的圆满来自于内心的平静。'
                    ],
                    closing: [
                        '随时回来，我一直在这里，不急不躁。',
                        '记住，生活是一场马拉松，不是短跑。',
                        '带着这份松弛感，去享受生活的每一刻。'
                    ]
                },
                // 音色配置
                voice: {
                    rate: 0.8,      // 语速舒缓
                    pitch: 0.9,     // 较低音调
                    volume: 0.9,    // 较低音量
                    voiceName: 'zh-CN-XiaomoNeural', // 温润女声
                    style: 'relaxed' // 松弛风格
                },
                // 系统提示词
                systemPrompt: `你是安心成长社的AI成长陪伴者，人设是"松弛通透陪伴型"。
你的核心特质：
- 温润舒缓，无压迫感
- 无说教感，像老朋友一样
- 松弛包容，传递通透感
- 专注于全关系成长、长期陪伴、情绪安抚

说话风格：
- 使用舒缓、放松的语气
- 语言简洁，不堆砌辞藻
- 善于用比喻和意象
- 传递"一切都好"的安全感
- 营造松弛、通透的氛围

红线规则：
- 绝对不替代专业心理咨询师/医生
- 遇到严重心理问题必须建议寻求专业帮助
- 只输出网站核心理念范围内的内容
- 不输出任何制造焦虑的内容`
            }
        };

        this.init();
    }

    init() {
        this.loadUserPreference();
    }

    // 获取当前人设
    getCurrentPersonality() {
        return this.personalities[this.currentPersonality];
    }

    // 获取所有人设列表
    getAllPersonalities() {
        return Object.values(this.personalities).map(p => ({
            id: p.id,
            name: p.name,
            stage: p.stage,
            icon: p.icon,
            color: p.color
        }));
    }

    // 切换人设
    setPersonality(personalityId) {
        if (!this.personalities[personalityId]) {
            console.error('不存在的人设:', personalityId);
            return false;
        }

        this.currentPersonality = personalityId;
        
        // 保存用户偏好
        localStorage.setItem('aiPersonality', personalityId);
        
        // 触发回调
        this.options.onPersonalityChange(this.getCurrentPersonality());
        
        return true;
    }

    // 获取随机话术
    getRandomPhrase(type) {
        const personality = this.personalities[this.currentPersonality];
        const phrases = personality.phrases[type];
        
        if (!phrases || phrases.length === 0) {
            return '';
        }
        
        const randomIndex = Math.floor(Math.random() * phrases.length);
        return phrases[randomIndex];
    }

    // 语音播报
    async speak(text, options = {}) {
        if (!window.speechSynthesis) {
            console.error('浏览器不支持语音合成');
            return { ok: false, message: '浏览器不支持语音合成' };
        }

        const personality = this.personalities[this.currentPersonality];
        const voiceConfig = { ...personality.voice, ...options };

        return new Promise((resolve, reject) => {
            // 取消之前的播报
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = voiceConfig.rate;
            utterance.pitch = voiceConfig.pitch;
            utterance.volume = voiceConfig.volume;

            // 选择合适的声音
            const voices = window.speechSynthesis.getVoices();
            
            // 尝试找到匹配的声音
            let selectedVoice = voices.find(v => 
                v.name.includes('Xiaoxiao') || 
                v.name.includes('Xiaoyi') || 
                v.name.includes('Chinese') ||
                v.lang.includes('zh-CN')
            );

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            this.isSpeaking = true;
            this.options.onSpeak(true);

            utterance.onstart = () => {
                console.log('开始播报:', text);
            };

            utterance.onend = () => {
                this.isSpeaking = false;
                this.options.onSpeak(false);
                resolve({ ok: true, message: '播报完成' });
            };

            utterance.onerror = (event) => {
                this.isSpeaking = false;
                this.options.onSpeak(false);
                reject({ ok: false, message: '播报失败: ' + event.error });
            };

            window.speechSynthesis.speak(utterance);
        });
    }

    // 停止播报
    stopSpeaking() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            this.isSpeaking = false;
            this.options.onSpeak(false);
        }
    }

    // 生成人设切换UI
    createPersonalitySwitcher(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error('容器元素不存在:', containerSelector);
            return;
        }

        const personalities = this.getAllPersonalities();
        const current = this.getCurrentPersonality();

        container.innerHTML = `
            <div class="personality-switcher">
                <div class="personality-header">
                    <span class="personality-label">当前人设</span>
                    <div class="current-personality" style="background: ${current.color}20; border-color: ${current.color}">
                        <span class="personality-icon">${current.icon}</span>
                        <span class="personality-name">${current.name}</span>
                    </div>
                </div>
                <div class="personality-options">
                    ${personalities.map(p => `
                        <button class="personality-option ${p.id === this.currentPersonality ? 'active' : ''}" 
                                data-personality="${p.id}"
                                style="--personality-color: ${p.color}">
                            <span class="option-icon">${p.icon}</span>
                            <span class="option-name">${p.name}</span>
                            <span class="option-stage">${p.stage}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // 添加样式
        this.addSwitcherStyles();

        // 绑定事件
        container.querySelectorAll('.personality-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const personalityId = btn.dataset.personality;
                if (this.setPersonality(personalityId)) {
                    // 更新UI
                    container.querySelectorAll('.personality-option').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // 更新当前显示
                    const newPersonality = this.getCurrentPersonality();
                    const currentEl = container.querySelector('.current-personality');
                    currentEl.style.background = newPersonality.color + '20';
                    currentEl.style.borderColor = newPersonality.color;
                    currentEl.querySelector('.personality-icon').textContent = newPersonality.icon;
                    currentEl.querySelector('.personality-name').textContent = newPersonality.name;
                }
            });
        });
    }

    addSwitcherStyles() {
        if (document.getElementById('personality-switcher-styles')) return;

        const style = document.createElement('style');
        style.id = 'personality-switcher-styles';
        style.textContent = `
            .personality-switcher {
                background: white;
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .personality-header {
                margin-bottom: 16px;
            }

            .personality-label {
                display: block;
                font-size: 12px;
                color: #999;
                margin-bottom: 8px;
            }

            .current-personality {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px;
                border-radius: 8px;
                border: 2px solid;
            }

            .personality-icon {
                font-size: 24px;
            }

            .personality-name {
                font-weight: 600;
                color: #333;
            }

            .personality-options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }

            .personality-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 12px 8px;
                border: 2px solid #E8DDD0;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .personality-option:hover {
                border-color: var(--personality-color);
                background: var(--personality-color) + '10';
            }

            .personality-option.active {
                border-color: var(--personality-color);
                background: var(--personality-color) + '20';
            }

            .option-icon {
                font-size: 24px;
                margin-bottom: 4px;
            }

            .option-name {
                font-size: 12px;
                font-weight: 600;
                color: #333;
                text-align: center;
            }

            .option-stage {
                font-size: 10px;
                color: #999;
                text-align: center;
                margin-top: 2px;
            }

            @media (max-width: 480px) {
                .personality-options {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // 加载用户偏好
    loadUserPreference() {
        const savedPersonality = localStorage.getItem('aiPersonality');
        if (savedPersonality && this.personalities[savedPersonality]) {
            this.currentPersonality = savedPersonality;
        }
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIPersonality;
}

if (typeof window !== 'undefined') {
    window.AIPersonality = AIPersonality;
}