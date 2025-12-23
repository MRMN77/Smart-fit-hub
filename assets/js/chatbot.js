// چت بات هوشمند SMART FIT
class SmartFitChatbot {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.initializeChatbot();
    }

    initializeChatbot() {
        // ایجاد عناصر چت بات
        this.createChatbotHTML();
        this.setupEventListeners();
        this.loadInitialMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div id="smartfit-chatbot" class="smartfit-chatbot">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fas fa-robot"></i>
                        <span>دستیار هوشمند SMART FIT</span>
                    </div>
                    <button class="chatbot-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chatbot-messages">
                    <div class="message bot">
                        <div class="message-content">
                            سلام! من دستیار هوشمند SMART FIT هستم. چطور می‌تونم کمک کنم؟
                        </div>
                        <div class="message-time">همین الان</div>
                    </div>
                </div>
                
                <div class="chatbot-input">
                    <input type="text" placeholder="سوال خود را بپرسید..." class="chatbot-input-field">
                    <button class="chatbot-send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            
            <button id="chatbot-toggle" class="chatbot-toggle-btn">
                <i class="fas fa-comment-dots"></i>
                <span class="chatbot-notification">!</span>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('chatbot-toggle');
        const closeBtn = document.querySelector('.chatbot-close');
        const sendBtn = document.querySelector('.chatbot-send');
        const inputField = document.querySelector('.chatbot-input-field');

        toggleBtn.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.closeChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChatbot() {
        const chatbot = document.getElementById('smartfit-chatbot');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatbot.classList.add('open');
            document.querySelector('.chatbot-input-field').focus();
        } else {
            chatbot.classList.remove('open');
        }
    }

    closeChatbot() {
        const chatbot = document.getElementById('smartfit-chatbot');
        chatbot.classList.remove('open');
        this.isOpen = false;
    }

    sendMessage() {
        const inputField = document.querySelector('.chatbot-input-field');
        const message = inputField.value.trim();
        
        if (!message) return;
        
        // نمایش پیام کاربر
        this.addMessage(message, 'user');
        inputField.value = '';
        
        // پاسخ هوش مصنوعی
        setTimeout(() => {
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    }

    addMessage(text, sender) {
        const messagesContainer = document.querySelector('.chatbot-messages');
        const time = new Date().toLocaleTimeString('fa-IR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const messageHTML = `
            <div class="message ${sender}">
                <div class="message-content">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // ذخیره در تاریخچه
        this.messages.push({ text, sender, time });
    }

    loadInitialMessage() {
        // پیام اولیه از قبل در HTML هست
    }

    getBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        const responses = {
            'سلام': 'سلام! خوش آمدید. چطور می‌تونم کمک کنم؟',
            'ورود': 'برای ورود به حساب کاربری، روی دکمه "ورود" در منوی بالا کلیک کنید.',
            'ثبت نام': 'برای ثبت‌نام رایگان، روی دکمه "ثبت‌نام رایگان" در منوی بالا کلیک کنید.',
            'برنامه ورزشی': 'ما برنامه‌های ورزشی شخصی‌سازی شده ارائه می‌دهیم. به داشبورد مراجعه کنید.',
            'تغذیه': 'برنامه‌های غذایی متناسب با هدف و شرایط شما طراحی می‌شود.',
            'قیمت': '۱۴ روز اول رایگان است! سپس می‌توانید از پلن‌های متنوع ما استفاده کنید.',
            'مربی': 'با مربیان حرفه‌ای ما در ارتباط باشید. در بخش "مربی" اطلاعات بیشتر موجود است.',
            'ورزش': 'برنامه‌های ورزشی متنوعی برای همه سطوح داریم.',
            'default': 'متوجه نشدم. می‌تونید در مورد ورود، ثبت‌نام، برنامه ورزشی یا تغذیه سوال بپرسید.'
        };
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }
}

// شروع چت بات وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', function() {
    window.smartFitChatbot = new SmartFitChatbot();
});
// فایل: assets/js/chatbot.js
// چت‌بات کمک‌کننده ثبت‌نام

const RegistrationChatbot = {
    // تنظیمات
    config: {
        botName: 'دستیار SMART FIT',
        botAvatar: '🤖',
        userAvatar: '👤',
        responseDelay: 800,
        helpTopics: {
            registration: 'ثبت‌نام',
            roles: 'نقش‌ها',
            verification: 'تأیید کد',
            features: 'امکانات'
        }
    },
    
    // وضعیت چت
    state: {
        currentStep: 1,
        userName: '',
        userRole: '',
        context: 'registration'
    },
    
    // پایگاه دانش
    knowledge: {
        greetings: [
            "سلام! من دستیار هوشمند SMART FIT هستم. چطور می‌تونم کمک کنم؟",
            "درود! خوش اومدید. برای ثبت‌نام یا راهنمایی در خدمتم.",
            "سلام عزیز! من اینجام تا ثبت‌نام رو برات راحت کنم."
        ],
        
        registrationHelp: [
            "ثبت‌نام در ۴ مرحله انجام میشه:\n1. اطلاعات شخصی\n2. مشخصات بدنی\n3. انتخاب نقش\n4. تأیید نهایی",
            "لطفاً هر مرحله رو با دقت پر کنید. اطلاعات شما محرمانه باقی می‌مونه.",
            "اگر در هر مرحله مشکل داشتید، من اینجام کمک کنم."
        ],
        
        roleExplanations: {
            athlete: "🏋️‍♂️ **ورزشکار**: برنامه تمرینی و تغذیه شخصی، ردیابی پیشرفت، ارتباط با مربی، شرکت در چالش‌ها",
            coach: "👨‍🏫 **مربی**: طراحی برنامه برای ورزشکاران، مدیریت پیشرفت، ارسال توصیه، آنالیز عملکرد",
            admin: "👑 **مدیر سیستم**: مدیریت کاربران، مشاهده گزارشات، تنظیمات سیستم، پشتیبانی"
        },
        
        commonQuestions: {
            "چطور ثبت‌نام کنم؟": "از فرم چندمرحله‌ای استفاده کنید. من در هر مرحله راهنمایی می‌کنم.",
            "ورزشکار چه امکاناتی داره؟": "برنامه تمرینی، برنامه غذایی، ردیابی پیشرفت، چت با مربی، چالش‌ها",
            "مربی چیکار میکنه؟": "برنامه‌نویسی تمرین، نظارت بر ورزشکاران، آنالیز داده‌ها، مشاوره",
            "کد تأیید چیه؟": "کد ۶ رقمی که به شماره شما پیامک میشه. برای تأیید شماره لازمه.",
            "اطلاعاتم امنه؟": "بله! اطلاعات شما رمزنگاری شده و فقط برای خدمات SMART FIT استفاده میشه."
        }
    },
    
    // تابع راه‌اندازی
    initialize: function(context = 'registration') {
        this.state.context = context;
        this.setupDOM();
        this.setupEventListeners();
        this.sendGreeting();
        
        console.log('🤖 چت‌بات ثبت‌نام راه‌اندازی شد');
    },
    
    // تنظیم DOM
    setupDOM: function() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) {
            console.error('❌ چت‌بات: کانتینر پیام‌ها پیدا نشد');
            return;
        }
        
        // پاک کردن پیام‌های قبلی
        messagesContainer.innerHTML = '';
        
        // پیام خوش‌آمدگویی
        this.addMessage('bot', 'در حال راه‌اندازی دستیار ثبت‌نام...');
    },
    
    // تنظیم event listeners
    setupEventListeners: function() {
        const sendBtn = document.getElementById('sendChatbotMessage');
        const input = document.getElementById('chatbotInput');
        
        if (sendBtn && input) {
            // ارسال با کلیک
            sendBtn.addEventListener('click', () => this.handleUserMessage());
            
            // ارسال با Enter
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserMessage();
                }
            });
        }
    },
    
    // مدیریت پیام کاربر
    handleUserMessage: function() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // نمایش پیام کاربر
        this.addMessage('user', message);
        input.value = '';
        
        // پاسخ با تأخیر
        setTimeout(() => {
            this.generateResponse(message);
        }, this.config.responseDelay);
    },
    
    // تولید پاسخ
    generateResponse: function(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';
        
        // تشخیص هدف پیام
        if (lowerMessage.includes('سلام') || lowerMessage.includes('درود')) {
            response = this.getRandomResponse(this.knowledge.greetings);
        }
        else if (lowerMessage.includes('ثبت') || lowerMessage.includes('نام')) {
            response = this.getRandomResponse(this.knowledge.registrationHelp);
        }
        else if (lowerMessage.includes('ورزشکار') || lowerMessage.includes('athlete')) {
            response = this.knowledge.roleExplanations.athlete;
        }
        else if (lowerMessage.includes('مربی') || lowerMessage.includes('coach')) {
            response = this.knowledge.roleExplanations.coach;
        }
        else if (lowerMessage.includes('مدیر') || lowerMessage.includes('admin')) {
            response = this.knowledge.roleExplanations.admin;
        }
        else if (lowerMessage.includes('کد') || lowerMessage.includes('تأیید')) {
            response = this.knowledge.commonQuestions['کد تأیید چیه؟'];
        }
        else if (lowerMessage.includes('امن') || lowerMessage.includes('حریم')) {
            response = this.knowledge.commonQuestions['اطلاعاتم امنه؟'];
        }
        else {
            // جستجو در سوالات متداول
            for (const [question, answer] of Object.entries(this.knowledge.commonQuestions)) {
                if (lowerMessage.includes(question.toLowerCase().replace('؟', ''))) {
                    response = answer;
                    break;
                }
            }
            
            // اگر پیدا نشد، پاسخ پیش‌فرض
            if (!response) {
                response = "متوجه سؤال شما نشدم. می‌تونم در مورد:\n" +
                          "- مراحل ثبت‌نام\n" +
                          "- نقش‌های مختلف (ورزشکار/مربی/مدیر)\n" +
                          "- کد تأیید\n" +
                          "- امنیت اطلاعات\n" +
                          "کمک کنم. چه سؤالی دارید؟";
            }
        }
        
        // نمایش پاسخ
        this.addMessage('bot', response);
    },
    
    // اضافه کردن پیام به چت
    addMessage: function(sender, text) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${sender === 'bot' ? this.config.botAvatar : this.config.userAvatar}
            </div>
            <div class="message-text">${this.formatText(text)}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    // فرمت‌دهی متن
    formatText: function(text) {
        // تبدیل خطوط جدید به <br>
        return text.replace(/\n/g, '<br>')
                   .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                   .replace(/\*(.*?)\*/g, '<em>$1</em>');
    },
    
    // ارسال پیام خوش‌آمدگویی
    sendGreeting: function() {
        setTimeout(() => {
            const greeting = this.getRandomResponse(this.knowledge.greetings);
            this.addMessage('bot', greeting);
            
            // اضافه کردن راهنمایی اولیه
            setTimeout(() => {
                this.addMessage('bot', "می‌تونم در ثبت‌نام بهتون کمک کنم. هر سؤالی دارید بپرسید!");
            }, 1000);
        }, 1500);
    },
    
    // نمایش راهنمایی بر اساس مرحله
    showHelp: function(message) {
        this.addMessage('bot', `💡 **راهنمایی**: ${message}`);
    },
    
    // به‌روزرسانی وضعیت
    updateState: function(step, userName = '', userRole = '') {
        this.state.currentStep = step;
        this.state.userName = userName;
        this.state.userRole = userRole;
        
        // ارسال راهنمایی متناسب با مرحله
        let helpMessage = '';
        switch(step) {
            case 1:
                helpMessage = "📝 **مرحله ۱: اطلاعات شخصی**\nنام، نام خانوادگی، تاریخ تولد و اطلاعات تماس رو وارد کنید.";
                break;
            case 2:
                helpMessage = "🏋️‍♂️ **مرحله ۲: مشخصات بدنی**\nقد، وزن، سطح ورزشی و هدف خودتون رو مشخص کنید.";
                break;
            case 3:
                helpMessage = "👥 **مرحله ۳: انتخاب نقش**\nورزشکار، مربی یا مدیر سیستم؟ هرکدوم مزایای خاص خودشون رو دارن.";
                break;
            case 4:
                helpMessage = "✅ **مرحله ۴: تأیید نهایی**\nاطلاعات رو مرور کنید و قوانین رو تأیید کنید.";
                break;
        }
        
        this.showHelp(helpMessage);
    },
    
    // دریافت پاسخ تصادفی از آرایه
    getRandomResponse: function(responsesArray) {
        return responsesArray[Math.floor(Math.random() * responsesArray.length)];
    }
};

// تابع عمومی برای راه‌اندازی چت‌بات
function initializeChatbot(context = 'registration') {
    RegistrationChatbot.initialize(context);
}

// تابع برای استفاده در سایر صفحات
function sendChatbotMessage(message) {
    RegistrationChatbot.addMessage('user', message);
    setTimeout(() => {
        RegistrationChatbot.generateResponse(message);
    }, RegistrationChatbot.config.responseDelay);
}

// در دسترس قرار دادن برای استفاده جهانی
window.RegistrationChatbot = RegistrationChatbot;
window.initializeChatbot = initializeChatbot;
window.sendChatbotMessage = sendChatbotMessage;