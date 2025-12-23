// فایل: assets/js/demo-navigation.js
// این اسکریپت فقط برای دموی پروژه دانشگاهی است و به هیچ بخشی آسیب نمی‌زند.

document.addEventListener('DOMContentLoaded', function() {
    console.log('اسکریپت ناوبری دمو فعال شد.');
    
    // 1. مدیریت دکمه‌های اصلی "ثبت‌نام" و "ورود" در صفحه اول
    const mainSignupBtn = document.querySelector('a[href="#"]:has(i.fa-user-plus)'); // دکمه با آیکون کاربر+
    const mainLoginBtn = document.querySelector('a[href="#"]:has(i.fa-sign-in-alt)'); // دکمه با آیکون ورود
    
    if(mainSignupBtn) {
        mainSignupBtn.addEventListener('click', function(e) {
            e.preventDefault(); // جلوگیری از پرش به بالا (#)
            alert('📝 در حال انتقال به صفحه ثبت‌نام... (این یک دمو است)');
            // هدایت به صفحه signup.html اگر وجود دارد، در غیر این صورت به صفحه اصلی
            window.location.href = 'pages/signup.html' || 'index.html';
        });
    }
    
    if(mainLoginBtn) {
        mainLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('🔐 در حال انتقال به صفحه ورود... (این یک دمو است)');
            window.location.href = 'pages/login.html' || 'index.html';
        });
    }
    
    // 2. مدیریت دکمه‌های "شروع کنید" یا Call-to-Action در صفحه اصلی
    const ctaButtons = document.querySelectorAll('a.btn-primary, a.btn-success');
    ctaButtons.forEach(btn => {
        if(btn.getAttribute('href') === '#') {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('🚀 بزن بریم! در حال انتقال به داشبورد آزمایشی...');
                // هدایت به داشبورد
                window.location.href = 'pages/dashboard.html' || 'index.html';
            });
        }
    });
    
    // 3. اگر کاربر در صفحه "ثبت‌نام" یا "ورود" بود، دکمه ارسال فرم را مدیریت کن
    const demoForms = document.querySelectorAll('form[action="#"]');
    demoForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // مهم: جلوگیری از ارسال واقعی فرم
            alert('✅ اطلاعات با موفقیت دریافت شد! در حال انتقال به داشبورد...');
            // تاخیر کمی برای واقعی‌تر شدن
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html' || 'index.html';
            }, 800);
        });
    });
    
    // 4. برای لینک‌های منو یا فوتر که href="#" دارند، پیام نمایش بده
    const allHashLinks = document.querySelectorAll('a[href="#"]');
    allHashLinks.forEach(link => {
        // فقط آنهایی که هنوز رویداد ندارند
        if(!link.hasAttribute('data-demo-handled')) {
            link.setAttribute('data-demo-handled', 'true');
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🔄 این لینک در حالت دمو غیرفعال است.');
            });
        }
    });
});

// تابع کمکی برای نمایش پیام در کنسول
function logDemoMessage(message) {
    console.log(`[SMART-FIT Demo]: ${message}`);
}