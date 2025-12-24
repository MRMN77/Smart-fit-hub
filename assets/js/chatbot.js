// ==================== SMART FIT Chatbot - Core Brain ====================
// فایل: assets/js/chatbot.js
// تاریخ ایجاد: دی ۱۴۰۳
// ====================

class SmartFitChatbot {
    constructor() {
        this.name = "SMART FIT Assistant";
        this.version = "2.0";
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.conversationHistory = [];
        this.userContext = {};
        
        console.log(`🤖 ${this.name} v${this.version} initialized`);
    }
    
    // ==================== پایگاه دانش ====================
    initializeKnowledgeBase() {
        return {
            // دانش عمومی سایت
            site: {
                pages: {
                    'صفحه اصلی': 'index.html - اولین صفحه سایت با معرفی پروژه',
                    'ورود': 'login.html - برای ورود کاربران عادی',
                    'ورود مدیر': 'login-admin.html - برای ورود مدیران سیستم',
                    'ثبت نام': 'register.html - برای ثبت‌نام کاربران جدید',
                    'داشبورد': 'dashboard.html - پنل کاربر ورزشکار',
                    'داشبورد مربی': 'coach-dashboard.html - پنل مربیان',
                    'داشبورد مدیر': 'admin-dashboard.html - پنل مدیریت سیستم',
                    'تعرفه‌ها': 'pricing.html - قیمت‌ها و پلن‌های مختلف',
                    'گالری': 'gallery.html - تصاویر و ویدیوهای ورزشی',
                    'چت': 'chat.html - سیستم پیام‌رسانی',
                    'پیام‌رسان': 'messaging.html - سیستم پیشرفته پیام‌رسانی'
                },
                
                roles: {
                    'ورزشکار': 'کاربر عادی که برنامه تمرینی و تغذیه دریافت می‌کند',
                    'مربی': 'متخصص ورزشی که ورزشکاران را راهنمایی می‌کند',
                    'مدیر': 'مدیر سیستم که کاربران و مربیان را مدیریت می‌کند'
                },
                
                features: {
                    'برنامه تمرینی': 'برنامه‌های شخصی‌سازی شده برای هر کاربر',
                    'برنامه تغذیه': 'رژیم غذایی متناسب با هدف ورزشی',
                    'ردیابی پیشرفت': 'نمودارها و آمار پیشرفت کاربر',
                    'سیستم پیام‌رسانی': 'ارتباط بین ورزشکار، مربی و مدیر',
                    'گزارش‌های مالی': 'گزارش‌های درآمد و هزینه‌ها',
                    'مدیریت کاربران': 'مدیریت کاربران، مربیان و مدیران'
                }
            },
            
            // دانش تخصصی ورزشی
            fitness: {
                workouts: {
                    'بدنسازی': 'تمرینات قدرتی برای عضله‌سازی - شامل اسکات، پرس سینه، ددلیفت',
                    'یوگا': 'تمرینات انعطاف و آرامش - مناسب برای کاهش استرس',
                    'کاردیو': 'تمرینات هوازی - دویدن، دوچرخه، شنا برای چربی‌سوزی',
                    'پیلاتس': 'تمرینات تقویت عضلات مرکزی بدن',
                    'کراس فیت': 'تمرینات شدید و ترکیبی',
                    'کیک‌بوکسینگ': 'تمرینات رزمی و دفاع شخصی'
                },
                
                nutrition: {
                    'پروتئین': 'برای عضله‌سازی و ترمیم بافت‌ها - مرغ، ماهی، تخم مرغ',
                    'کربوهیدرات': 'منبع انرژی - برنج، سیب زمینی، نان سبوس‌دار',
                    'چربی سالم': 'برای هورمون‌ها و انرژی - آووکادو، مغزها، روغن زیتون',
                    'ویتامین‌ها': 'میوه‌ها و سبزیجات تازه',
                    'آب': 'نوشیدن ۸ لیوان آب در روز ضروری است'
                },
                
                tips: {
                    'گرم کردن': 'قبل از تمرین ۱۰ دقیقه گرم کنید تا از آسیب جلوگیری شود',
                    'سرد کردن': 'بعد از تمرین ۵ دقیقه حرکات کششی انجام دهید',
                    'تغذیه قبل تمرین': '۲ ساعت قبل تمرین غذای سبک حاوی کربوهیدرات بخورید',
                    'تغذیه بعد تمرین': 'تا ۱ ساعت بعد تمرین پروتئین مصرف کنید',
                    'استراحت': 'بین ست‌ها ۶۰-۹۰ ثانیه و بین جلسات ۴۸ ساعت استراحت کنید'
                }
            },
            
            // دانش مدیریتی
            management: {
                'تایید کاربران': 'مدیر می‌تواند کاربران جدید را تایید یا رد کند',
                'مدیریت مربیان': 'مدیر می‌تواند مربیان را مدیریت و نظارت کند',
                'گزارش‌های مالی': 'گزارش درآمدها، هزینه‌ها و سود سیستم',
                'تنظیمات سیستم': 'تنظیمات کلی سیستم و پیکربندی',
                'پشتیبانی': 'پاسخ به سوالات و مشکلات کاربران'
            },
            
            // سوالات متداول
            faq: {
                'چگونه ثبت نام کنم؟': 'به صفحه register.html بروید و اطلاعات خود را وارد کنید',
                'چگونه وارد شوم؟': 'اگر کاربر عادی هستید به login.html، اگر مدیر هستید به login-admin.html بروید',
                'برنامه تمرینی چگونه است؟': 'بعد از ورود، در داشبورد برنامه شخصی‌سازی شده خود را می‌بینید',
                'چگونه با مربی ارتباط برقرار کنم؟': 'در داشبورد خود بخش "مربی من" را ببینید',
                'قیمت‌ها چقدر است؟': 'به صفحه pricing.html مراجعه کنید',
                'چگونه مربی شوم؟': 'ثبت‌نام کنید و درخواست مربیگری دهید تا مدیر تایید کند',
                'چگونه مدیر شوم؟': 'فقط توسط مدیران ارشد سیستم قابل تنظیم است',
                'سیستم پرداخت چگونه است؟': 'از طریق درگاه بانکی در صفحه پرداخت'
            }
        };
    }
    
    // ==================== پردازش سوال کاربر ====================
    processQuestion(userQuestion) {
        const question = userQuestion.toLowerCase().trim();
        this.saveToHistory('user', userQuestion);
        
        // 1. بررسی سلام و احوالپرسی
        if (this.isGreeting(question)) {
            return this.getGreetingResponse();
        }
        
        // 2. بررسی سوالات متداول
        const faqAnswer = this.checkFAQ(question);
        if (faqAnswer) return faqAnswer;
        
        // 3. بررسی صفحات سایت
        const pageAnswer = this.checkPages(question);
        if (pageAnswer) return pageAnswer;
        
        // 4. بررسی تمرینات ورزشی
        const workoutAnswer = this.checkWorkouts(question);
        if (workoutAnswer) return workoutAnswer;
        
        // 5. بررسی تغذیه
        const nutritionAnswer = this.checkNutrition(question);
        if (nutritionAnswer) return nutritionAnswer;
        
        // 6. بررسی مدیریت
        const managementAnswer = this.checkManagement(question);
        if (managementAnswer) return managementAnswer;
        
        // 7. پاسخ پیش‌فرض
        return this.getDefaultResponse();
    }
    
    // ==================== توابع کمکی ====================
    isGreeting(question) {
        const greetings = ['سلام', 'hello', 'hi', 'درود', 'سلامتی', 'سلامت باشید', 'صبح بخیر', 'عصر بخیر'];
        return greetings.some(greet => question.includes(greet));
    }
    
    getGreetingResponse() {
        const responses = [
            'سلام! 😊 خوش آمدید به SMART FIT. چطور می‌تونم کمکتون کنم؟',
            'درود! 💪 به دستیار هوشمند SMART FIT خوش آمدید. چه سوالی دارید؟',
            'سلام عزیز! امروز چه کاری براتون انجام بدم؟'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.saveToHistory('bot', response);
        return response;
    }
    
    checkFAQ(question) {
        for (const [faqQuestion, answer] of Object.entries(this.knowledgeBase.faq)) {
            if (question.includes(faqQuestion.toLowerCase())) {
                this.saveToHistory('bot', answer);
                return answer;
            }
        }
        return null;
    }
    
    checkPages(question) {
        for (const [pageName, pageDescription] of Object.entries(this.knowledgeBase.site.pages)) {
            if (question.includes(pageName.toLowerCase())) {
                const response = `صفحه "${pageName}": ${pageDescription}`;
                this.saveToHistory('bot', response);
                return response;
            }
        }
        return null;
    }
    
    checkWorkouts(question) {
        for (const [workoutName, workoutDescription] of Object.entries(this.knowledgeBase.fitness.workouts)) {
            if (question.includes(workoutName.toLowerCase())) {
                const response = `تمرین ${workoutName}: ${workoutDescription}`;
                this.saveToHistory('bot', response);
                return response;
            }
        }
        return null;
    }
    
    checkNutrition(question) {
        for (const [nutrient, description] of Object.entries(this.knowledgeBase.fitness.nutrition)) {
            if (question.includes(nutrient.toLowerCase())) {
                const response = `${nutrient}: ${description}`;
                this.saveToHistory('bot', response);
                return response;
            }
        }
        return null;
    }
    
    checkManagement(question) {
        for (const [task, description] of Object.entries(this.knowledgeBase.management)) {
            if (question.includes(task.toLowerCase())) {
                const response = `${task}: ${description}`;
                this.saveToHistory('bot', response);
                return response;
            }
        }
        return null;
    }
    
    getDefaultResponse() {
        const responses = [
            'متأسفم! کاملاً متوجه نشدم. می‌تونید سوال خود را واضح‌تر بپرسید؟',
            'لطفاً سوال خود را به صورت دقیق‌تر مطرح کنید تا بتونم کمک کنم.',
            'این سوال رو متوجه نشدم. در مورد صفحات سایت، تمرینات، تغذیه یا مدیریت بپرسید.',
            'می‌تونید از من در مورد: صفحات سایت، برنامه تمرینی، تغذیه یا مدیریت سیستم بپرسید.'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.saveToHistory('bot', response);
        return response;
    }
    
    saveToHistory(sender, message) {
        this.conversationHistory.push({
            sender,
            message,
            timestamp: new Date().toLocaleTimeString('fa-IR')
        });
        
        // محدود کردن تاریخچه به ۵۰ پیام آخر
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
    }
    
    getConversationHistory() {
        return this.conversationHistory;
    }
    
    // آموزش چت‌بات با داده جدید
    teach(newQuestion, newAnswer) {
        this.knowledgeBase.faq[newQuestion] = newAnswer;
        return `✅ آموزش دادم! حالا در مورد "${newQuestion}" می‌دانم.`;
    }
    
    // گرفتن آمار چت‌بات
    getStats() {
        return {
            name: this.name,
            version: this.version,
            totalKnowledge: Object.keys(this.knowledgeBase.faq).length + 
                           Object.keys(this.knowledgeBase.site.pages).length +
                           Object.keys(this.knowledgeBase.fitness.workouts).length,
            conversationCount: this.conversationHistory.length,
            lastActive: new Date().toLocaleString('fa-IR')
        };
    }
}

// ایجاد نمونه جهانی از چت‌بات
window.SmartFitChatbot = SmartFitChatbot;