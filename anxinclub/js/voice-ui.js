/**
 * 安心成长社 - 语音交互UI组件
 * 功能：提供友好的语音交互界面和用户体验
 */

class VoiceUI {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.options = {
            onResult: options.onResult || (() => {}),
            onError: options.onError || (() => {}),
            onStart: options.onStart || (() => {}),
            onEnd: options.onEnd || (() => {}),
            placeholder: options.placeholder || '点击麦克风开始说话...',
            ...options
        };
        
        this.isRecording = false;
        this.voiceCore = window.voiceCore;
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('VoiceUI: 容器元素不存在');
            return;
        }

        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="voice-input-container">
                <div class="voice-input-wrapper">
                    <input type="text" 
                           class="voice-text-input" 
                           placeholder="${this.options.placeholder}" 
                           readonly>
                    <button class="voice-mic-btn" title="点击说话">
                        <i class="fa fa-microphone"></i>
                    </button>
                    <button class="voice-send-btn" title="发送">
                        <i class="fa fa-paper-plane"></i>
                    </button>
                </div>
                <div class="voice-status-bar">
                    <span class="voice-status-text">点击麦克风开始语音输入</span>
                    <div class="voice-waveform" style="display: none;">
                        <span></span><span></span><span></span><span></span><span></span>
                    </div>
                </div>
            </div>
            <div class="voice-toast"></div>
        `;

        // 添加样式
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('voice-ui-styles')) return;

        const style = document.createElement('style');
        style.id = 'voice-ui-styles';
        style.textContent = `
            .voice-input-container {
                position: relative;
                width: 100%;
            }

            .voice-input-wrapper {
                display: flex;
                align-items: center;
                background: #fff;
                border: 1px solid #E8DDD0;
                border-radius: 24px;
                padding: 4px;
                transition: all 0.3s ease;
            }

            .voice-input-wrapper:focus-within {
                border-color: #8FB9A8;
                box-shadow: 0 0 0 3px rgba(143, 185, 168, 0.1);
            }

            .voice-text-input {
                flex: 1;
                border: none;
                background: transparent;
                padding: 8px 12px;
                font-size: 14px;
                color: #333;
                outline: none;
            }

            .voice-text-input::placeholder {
                color: #999;
            }

            .voice-mic-btn,
            .voice-send-btn {
                width: 36px;
                height: 36px;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                margin-left: 4px;
            }

            .voice-mic-btn {
                background: #E8DDD0;
                color: #8B7355;
            }

            .voice-mic-btn:hover {
                background: #8FB9A8;
                color: #fff;
            }

            .voice-mic-btn.recording {
                background: #ff6b6b;
                color: #fff;
                animation: pulse 1.5s infinite;
            }

            .voice-send-btn {
                background: #8FB9A8;
                color: #fff;
            }

            .voice-send-btn:hover {
                background: #7aa897;
            }

            .voice-send-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .voice-status-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 4px 12px;
                font-size: 12px;
                color: #999;
            }

            .voice-waveform {
                display: flex;
                align-items: center;
                gap: 2px;
                height: 16px;
            }

            .voice-waveform span {
                width: 3px;
                background: #8FB9A8;
                border-radius: 2px;
                animation: wave 0.5s ease-in-out infinite;
            }

            .voice-waveform span:nth-child(1) { animation-delay: 0s; height: 8px; }
            .voice-waveform span:nth-child(2) { animation-delay: 0.1s; height: 12px; }
            .voice-waveform span:nth-child(3) { animation-delay: 0.2s; height: 16px; }
            .voice-waveform span:nth-child(4) { animation-delay: 0.3s; height: 12px; }
            .voice-waveform span:nth-child(5) { animation-delay: 0.4s; height: 8px; }

            @keyframes wave {
                0%, 100% { transform: scaleY(0.5); }
                50% { transform: scaleY(1); }
            }

            .voice-toast {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 16px 24px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 9999;
                display: none;
                max-width: 300px;
                text-align: center;
                line-height: 1.5;
            }

            .voice-toast.show {
                display: block;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -40%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }

            .voice-toast .toast-title {
                font-weight: bold;
                margin-bottom: 8px;
                color: #ff6b6b;
            }

            .voice-toast .toast-solution {
                margin-top: 8px;
                font-size: 12px;
                color: #ccc;
            }
        `;

        document.head.appendChild(style);
    }

    bindEvents() {
        const micBtn = this.container.querySelector('.voice-mic-btn');
        const sendBtn = this.container.querySelector('.voice-send-btn');
        const textInput = this.container.querySelector('.voice-text-input');

        micBtn.addEventListener('click', () => this.toggleRecording());
        sendBtn.addEventListener('click', () => this.sendText());
        
        textInput.addEventListener('focus', () => {
            textInput.removeAttribute('readonly');
        });

        textInput.addEventListener('blur', () => {
            textInput.setAttribute('readonly', true);
        });

        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendText();
            }
        });
    }

    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    async startRecording() {
        const result = await this.voiceCore.startRecording(
            (data) => this.onRecognitionResult(data),
            (error) => this.onRecognitionError(error),
            () => this.onRecognitionEnd()
        );

        if (result.ok) {
            this.isRecording = true;
            this.updateUIState('recording');
            this.options.onStart();
        } else {
            this.showToast(result.message, result.solution);
            this.options.onError(result);
        }
    }

    stopRecording() {
        this.voiceCore.stopRecording();
        this.isRecording = false;
        this.updateUIState('idle');
    }

    onRecognitionResult(data) {
        const textInput = this.container.querySelector('.voice-text-input');
        textInput.value = data.interim || data.final;

        if (data.isFinal) {
            this.isRecording = false;
            this.updateUIState('idle');
            this.options.onResult(data.final);
        }
    }

    onRecognitionError(error) {
        this.isRecording = false;
        this.updateUIState('idle');
        this.showToast(error.message, error.solution);
        this.options.onError(error);
    }

    onRecognitionEnd() {
        this.isRecording = false;
        this.updateUIState('idle');
        this.options.onEnd();
    }

    updateUIState(state) {
        const micBtn = this.container.querySelector('.voice-mic-btn');
        const waveform = this.container.querySelector('.voice-waveform');
        const statusText = this.container.querySelector('.voice-status-text');

        if (state === 'recording') {
            micBtn.classList.add('recording');
            micBtn.innerHTML = '<i class="fa fa-stop"></i>';
            waveform.style.display = 'flex';
            statusText.textContent = '正在聆听，请说话...';
        } else {
            micBtn.classList.remove('recording');
            micBtn.innerHTML = '<i class="fa fa-microphone"></i>';
            waveform.style.display = 'none';
            statusText.textContent = '点击麦克风开始语音输入';
        }
    }

    sendText() {
        const textInput = this.container.querySelector('.voice-text-input');
        const text = textInput.value.trim();
        
        if (text) {
            this.options.onResult(text);
            textInput.value = '';
        }
    }

    showToast(message, solution) {
        const toast = this.container.querySelector('.voice-toast');
        toast.innerHTML = `
            <div class="toast-title">提示</div>
            <div>${message}</div>
            ${solution ? `<div class="toast-solution">${solution}</div>` : ''}
        `;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    setText(text) {
        const textInput = this.container.querySelector('.voice-text-input');
        textInput.value = text;
    }

    getText() {
        const textInput = this.container.querySelector('.voice-text-input');
        return textInput.value.trim();
    }

    clear() {
        const textInput = this.container.querySelector('.voice-text-input');
        textInput.value = '';
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceUI;
}

if (typeof window !== 'undefined') {
    window.VoiceUI = VoiceUI;
}