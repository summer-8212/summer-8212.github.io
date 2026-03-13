/**
 * 安心成长社 - 语音交互核心模块
 * 功能：麦克风权限管理、语音识别、语音合成、全浏览器兼容
 * 作者：资深前端开发工程师
 * 版本：v2.1
 */

class VoiceCore {
    constructor() {
        this.isInitialized = false;
        this.isRecording = false;
        this.recognition = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.permissionStatus = 'unknown'; // 'granted', 'denied', 'prompt', 'unknown'
        this.browserInfo = this.detectBrowser();
        this.isHTTPS = window.location.protocol === 'https:';
        this.isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        // 初始化
        this.init();
    }

    /**
     * 浏览器检测
     */
    detectBrowser() {
        const ua = navigator.userAgent.toLowerCase();
        const isWeChat = /micromessenger/.test(ua);
        const isQQ = /qqbrowser/.test(ua);
        const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
        const isChrome = /chrome/.test(ua) && !/edge/.test(ua);
        const isEdge = /edge/.test(ua);
        const isFirefox = /firefox/.test(ua);
        const isIOS = /iphone|ipad|ipod/.test(ua);
        const isAndroid = /android/.test(ua);

        return {
            isWeChat,
            isQQ,
            isSafari,
            isChrome,
            isEdge,
            isFirefox,
            isIOS,
            isAndroid,
            name: isWeChat ? 'WeChat' : isQQ ? 'QQ' : isSafari ? 'Safari' : isChrome ? 'Chrome' : isEdge ? 'Edge' : isFirefox ? 'Firefox' : 'Unknown'
        };
    }

    /**
     * 检查安全上下文
     */
    checkSecureContext() {
        if (this.isHTTPS || this.isLocalhost) {
            return { ok: true, message: '安全上下文正常' };
        }
        return { 
            ok: false, 
            message: '麦克风功能需要在HTTPS或localhost环境下使用',
            solution: '请使用HTTPS访问网站，或在本地开发环境测试'
        };
    }

    /**
     * 检查浏览器兼容性
     */
    checkBrowserCompatibility() {
        const issues = [];

        // 检查 getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            issues.push({
                type: 'api_missing',
                message: '您的浏览器不支持麦克风功能',
                solution: '请使用Chrome、Edge、Safari等现代浏览器'
            });
        }

        // 检查 SpeechRecognition
        const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        if (!hasSpeechRecognition) {
            issues.push({
                type: 'speech_api_missing',
                message: '您的浏览器不支持语音识别功能',
                solution: '语音识别功能需要Chrome或Edge浏览器'
            });
        }

        // 微信浏览器特殊处理
        if (this.browserInfo.isWeChat) {
            issues.push({
                type: 'wechat_limitation',
                message: '微信内置浏览器对麦克风支持有限',
                solution: '建议在Chrome或Safari浏览器中打开网站以获得最佳体验'
            });
        }

        // iOS Safari 特殊处理
        if (this.browserInfo.isIOS && this.browserInfo.isSafari) {
            issues.push({
                type: 'ios_safari_limitation',
                message: 'iOS Safari 需要用户交互后才能使用麦克风',
                solution: '请点击麦克风按钮后，在弹出的权限申请中选择"允许"'
            });
        }

        return {
            ok: issues.length === 0,
            issues,
            canUseBasic: navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
            canUseSpeech: hasSpeechRecognition
        };
    }

    /**
     * 检查麦克风权限状态
     */
    async checkPermission() {
        try {
            if (navigator.permissions && navigator.permissions.query) {
                const result = await navigator.permissions.query({ name: 'microphone' });
                this.permissionStatus = result.state;
                
                result.onchange = () => {
                    this.permissionStatus = result.state;
                    console.log('麦克风权限状态变化:', result.state);
                };

                return {
                    status: result.state,
                    ok: result.state === 'granted',
                    message: result.state === 'granted' ? '权限已授予' : 
                             result.state === 'denied' ? '权限被拒绝' : '需要申请权限'
                };
            }
            
            // 如果不支持 permissions API，返回未知状态
            return {
                status: 'unknown',
                ok: false,
                message: '无法检测权限状态'
            };
        } catch (error) {
            console.error('检查权限失败:', error);
            return {
                status: 'error',
                ok: false,
                message: '检查权限时出错: ' + error.message
            };
        }
    }

    /**
     * 申请麦克风权限
     */
    async requestPermission() {
        try {
            // 先检查安全上下文
            const secureCheck = this.checkSecureContext();
            if (!secureCheck.ok) {
                return {
                    ok: false,
                    type: 'insecure_context',
                    message: secureCheck.message,
                    solution: secureCheck.solution
                };
            }

            // 检查浏览器兼容性
            const compatCheck = this.checkBrowserCompatibility();
            if (!compatCheck.canUseBasic) {
                return {
                    ok: false,
                    type: 'browser_incompatible',
                    message: '您的浏览器不支持麦克风功能',
                    solution: '请使用Chrome、Edge、Safari等现代浏览器'
                };
            }

            // 申请权限
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            // 立即释放流，仅用于权限申请
            stream.getTracks().forEach(track => track.stop());

            this.permissionStatus = 'granted';
            
            return {
                ok: true,
                type: 'permission_granted',
                message: '麦克风权限申请成功'
            };

        } catch (error) {
            console.error('申请权限失败:', error);
            
            let errorInfo = {
                ok: false,
                type: 'unknown_error',
                message: '申请权限失败: ' + error.message,
                solution: '请刷新页面重试'
            };

            // 处理特定错误
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                errorInfo = {
                    ok: false,
                    type: 'permission_denied',
                    message: '麦克风权限被拒绝',
                    solution: '请在浏览器地址栏点击🔒图标，将麦克风权限设置为"允许"，然后刷新页面'
                };
            } else if (error.name === 'NotFoundError') {
                errorInfo = {
                    ok: false,
                    type: 'device_not_found',
                    message: '未找到可用的麦克风设备',
                    solution: '请检查您的设备是否连接了麦克风，或尝试使用带麦克风的耳机'
                };
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                errorInfo = {
                    ok: false,
                    type: 'device_in_use',
                    message: '麦克风被其他应用占用',
                    solution: '请关闭其他正在使用麦克风的应用（如微信语音、Zoom会议等），然后重试'
                };
            } else if (error.name === 'SecurityError') {
                errorInfo = {
                    ok: false,
                    type: 'security_error',
                    message: '安全策略阻止了麦克风访问',
                    solution: '请确保使用HTTPS访问网站，或联系网站管理员'
                };
            }

            return errorInfo;
        }
    }

    /**
     * 初始化语音识别
     */
    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        return recognition;
    }

    /**
     * 开始录音
     */
    async startRecording(onResult, onError, onEnd) {
        if (this.isRecording) {
            return { ok: false, message: '正在录音中' };
        }

        try {
            // 检查并申请权限
            const permissionResult = await this.requestPermission();
            if (!permissionResult.ok) {
                if (onError) onError(permissionResult);
                return permissionResult;
            }

            // 初始化语音识别
            this.recognition = this.initSpeechRecognition();
            
            if (!this.recognition) {
                const error = {
                    ok: false,
                    type: 'speech_not_supported',
                    message: '您的浏览器不支持语音识别',
                    solution: '请使用Chrome或Edge浏览器以获得完整的语音功能'
                };
                if (onError) onError(error);
                return error;
            }

            // 设置事件处理
            this.recognition.onstart = () => {
                this.isRecording = true;
                console.log('语音识别开始');
            };

            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (onResult) {
                    onResult({
                        final: finalTranscript,
                        interim: interimTranscript,
                        isFinal: event.results[event.results.length - 1].isFinal
                    });
                }
            };

            this.recognition.onerror = (event) => {
                console.error('语音识别错误:', event.error);
                
                let errorInfo = {
                    ok: false,
                    type: 'speech_error',
                    message: '语音识别出错: ' + event.error
                };

                if (event.error === 'no-speech') {
                    errorInfo.message = '未检测到语音，请靠近麦克风说话';
                    errorInfo.solution = '请确保在安静的环境中，靠近麦克风清晰说话';
                } else if (event.error === 'audio-capture') {
                    errorInfo.message = '无法捕获音频';
                    errorInfo.solution = '请检查麦克风是否正常工作';
                } else if (event.error === 'not-allowed') {
                    errorInfo.message = '麦克风权限被拒绝';
                    errorInfo.solution = '请在浏览器设置中允许麦克风权限';
                } else if (event.error === 'network') {
                    errorInfo.message = '网络错误，语音识别服务不可用';
                    errorInfo.solution = '请检查网络连接，或稍后再试';
                }

                this.isRecording = false;
                if (onError) onError(errorInfo);
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                console.log('语音识别结束');
                if (onEnd) onEnd();
            };

            // 开始识别
            this.recognition.start();

            return { ok: true, message: '开始录音' };

        } catch (error) {
            console.error('开始录音失败:', error);
            this.isRecording = false;
            
            const errorInfo = {
                ok: false,
                type: 'start_error',
                message: '启动录音失败: ' + error.message,
                solution: '请刷新页面重试'
            };
            
            if (onError) onError(errorInfo);
            return errorInfo;
        }
    }

    /**
     * 停止录音
     */
    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
            this.isRecording = false;
            return { ok: true, message: '停止录音' };
        }
        return { ok: false, message: '未在录音状态' };
    }

    /**
     * 文本转语音
     */
    speak(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (!window.speechSynthesis) {
                reject({
                    ok: false,
                    message: '您的浏览器不支持语音播报'
                });
                return;
            }

            try {
                // 取消之前的播报
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'zh-CN';
                utterance.rate = options.rate || 1;
                utterance.pitch = options.pitch || 1;
                utterance.volume = options.volume || 1;

                // 选择合适的声音
                const voices = window.speechSynthesis.getVoices();
                const chineseVoice = voices.find(voice => 
                    voice.lang.includes('zh') || voice.lang.includes('CN')
                );
                if (chineseVoice) {
                    utterance.voice = chineseVoice;
                }

                utterance.onstart = () => {
                    console.log('开始播报');
                };

                utterance.onend = () => {
                    resolve({ ok: true, message: '播报完成' });
                };

                utterance.onerror = (event) => {
                    reject({
                        ok: false,
                        message: '播报失败: ' + event.error
                    });
                };

                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('语音播报错误:', error);
                reject({
                    ok: false,
                    message: '语音播报失败: ' + error.message
                });
            }
        });
    }

    /**
     * 初始化
     */
    async init() {
        try {
            console.log('VoiceCore 初始化中...');
            console.log('浏览器信息:', this.browserInfo);
            console.log('安全上下文:', this.checkSecureContext());
            console.log('兼容性检查:', this.checkBrowserCompatibility());
            
            // 预加载语音列表
            if (window.speechSynthesis) {
                try {
                    window.speechSynthesis.getVoices();
                    window.speechSynthesis.onvoiceschanged = () => {
                        console.log('语音列表已加载');
                    };
                } catch (error) {
                    console.warn('语音合成初始化失败:', error);
                }
            }

            this.isInitialized = true;
            console.log('VoiceCore 初始化完成');
        } catch (error) {
            console.error('VoiceCore 初始化失败:', error);
            this.isInitialized = false;
        }
    }
}

// 导出单例
const voiceCore = new VoiceCore();

// 兼容多种模块系统
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceCore;
}

if (typeof window !== 'undefined') {
    window.VoiceCore = VoiceCore;
    window.voiceCore = voiceCore;
}