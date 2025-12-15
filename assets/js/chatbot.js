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