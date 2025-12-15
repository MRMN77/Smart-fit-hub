// فایل اصلی JavaScript - Smart Fit Hub - نسخه کامل

// Document Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Smart Fit Hub loaded successfully');
    
    // مقداردهی اولیه برنامه
    initApp();
    
    // راه‌اندازی رویدادها
    setupEventListeners();
    
    // بررسی وضعیت لاگین
    checkLoginStatus();
    
    // بارگذاری داده‌های اولیه
    loadInitialData();
    
    // راه‌اندازی نمودارها
    initCharts();
    
    // راه‌اندازی تقویم
    initCalendar();
    
    // راه‌اندازی چت
    initChat();
});

// ==================== تابع‌های اصلی ====================

// مقداردهی اولیه برنامه
function initApp() {
    // تنظیم زبان
    const savedLang = localStorage.getItem('preferredLang') || 'fa';
    setLanguage(savedLang);
    
    // تنظیم تم
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // تنظیم منطقه زمانی
    setTimezone();
    
    // تنظیم toastr
    initToastr();
    
    // تنظیم تاریخ شمسی
    initPersianDate();
    
    console.log('✅ App initialized successfully');
}

// تنظیم رویدادها
function setupEventListeners() {
    // منوی موبایل
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // فرم‌ها
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // دکمه‌های رزرو
    document.addEventListener('click', function(e) {
        if (e.target.closest('.book-btn, .reserve-btn, .book-class-btn')) {
            e.preventDefault();
            handleBooking(e.target.closest('button'));
        }
    });
    
    // تغییر زبان
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.dataset.lang;
            changeLanguage(lang);
        });
    });
    
    // تغییر تم
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // آپلود فایل
    const fileUploads = document.querySelectorAll('.file-upload input[type="file"]');
    fileUploads.forEach(input => {
        input.addEventListener('change', handleFileUpload);
    });
    
    // جستجو
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // فیلترها
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(filter => {
        filter.addEventListener('click', handleFilter);
    });
    
    // مرتب‌سازی
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // آکاردئون
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', toggleAccordion);
    });
    
    // مدال‌ها
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-toggle="modal"]')) {
            const target = e.target.closest('[data-toggle="modal"]').dataset.target;
            openModal(target);
        }
        
        if (e.target.closest('.modal-close, .modal .btn-close')) {
            closeModal();
        }
    });
    
    // کلیک خارج از مدال
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // اعتبارسنجی فرم در لحظه
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidation);
    });
    
    // انتخاب تاریخ
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('focus', showDatePicker);
    });
    
    // سیستم چت
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // رفرش خودکار داده‌ها
    setInterval(refreshData, 30000); // هر 30 ثانیه
    
    console.log('✅ Event listeners setup completed');
}

// بررسی وضعیت لاگین
function checkLoginStatus() {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['dashboard.html', 'profile.html', 'admin-dashboard.html', 'coach-dashboard.html'];
    
    if (protectedPages.includes(currentPage)) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userRole = localStorage.getItem('userRole');
        
        if (isLoggedIn !== 'true') {
            showToast('لطفاً ابتدا وارد شوید', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return false;
        }
        
        // بررسی نقش کاربر برای صفحات خاص
        if (currentPage === 'admin-dashboard.html' && userRole !== 'admin') {
            showToast('شما دسترسی به این صفحه را ندارید', 'error');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            return false;
        }
        
        if (currentPage === 'coach-dashboard.html' && userRole !== 'coach') {
            showToast('شما دسترسی به این صفحه را ندارید', 'error');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            return false;
        }
    }
    
    // بروزرسانی UI بر اساس وضعیت لاگین
    updateUIForLoginStatus();
    
    return true;
}

// بروزرسانی UI بر اساس وضعیت لاگین
function updateUIForLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole') || 'guest';
    const userName = localStorage.getItem('userName') || 'کاربر';
    const userEmail = localStorage.getItem('userEmail') || '';
    
    const loginButtons = document.querySelectorAll('.login-btn');
    const logoutButtons = document.querySelectorAll('.logout-btn');
    const userMenus = document.querySelectorAll('.user-menu');
    const userNameElements = document.querySelectorAll('.user-name, #userName');
    const userRoleElements = document.querySelectorAll('.user-role, #userRole');
    
    if (isLoggedIn) {
        // مخفی کردن دکمه‌های ورود و نمایش دکمه خروج
        loginButtons.forEach(btn => btn.style.display = 'none');
        logoutButtons.forEach(btn => btn.style.display = 'block');
        
        // بروزرسانی نام کاربر
        userNameElements.forEach(el => {
            el.textContent = userName;
        });
        
        // بروزرسانی نقش کاربر
        userRoleElements.forEach(el => {
            const roleText = getRoleName(userRole);
            el.textContent = roleText;
            el.className = el.className.replace(/badge-\w+/, `badge-${userRole}`);
        });
        
        // بروزرسانی دسترسی بر اساس نقش
        updateAccessBasedOnRole(userRole);
        
        // بروزرسانی آواتار
        updateUserAvatar();
    } else {
        loginButtons.forEach(btn => btn.style.display = 'block');
        logoutButtons.forEach(btn => btn.style.display = 'none');
    }
}

// ==================== توابع کاربری ====================

// دریافت نام نقش
function getRoleName(role) {
    const roles = {
        'admin': 'مدیر سیستم',
        'coach': 'مربی',
        'athlete': 'ورزشکار',
        'guest': 'مهمان'
    };
    return roles[role] || 'کاربر';
}

// بروزرسانی دسترسی بر اساس نقش
function updateAccessBasedOnRole(role) {
    // مخفی کردن المان‌های غیرمجاز
    const adminElements = document.querySelectorAll('.admin-only');
    const coachElements = document.querySelectorAll('.coach-only');
    const athleteElements = document.querySelectorAll('.athlete-only');
    const guestElements = document.querySelectorAll('.guest-only');
    
    adminElements.forEach(el => {
        el.style.display = role === 'admin' ? 'block' : 'none';
    });
    
    coachElements.forEach(el => {
        el.style.display = role === 'coach' ? 'block' : 'none';
    });
    
    athleteElements.forEach(el => {
        el.style.display = role === 'athlete' ? 'block' : 'none';
    });
    
    guestElements.forEach(el => {
        el.style.display = role === 'guest' ? 'block' : 'none';
    });
}

// بروزرسانی آواتار کاربر
function updateUserAvatar() {
    const userAvatar = localStorage.getItem('userAvatar');
    const avatarElements = document.querySelectorAll('.user-avatar, .profile-avatar');
    
    avatarElements.forEach(avatar => {
        if (userAvatar) {
            avatar.innerHTML = `<img src="${userAvatar}" alt="آواتار کاربر" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            const userName = localStorage.getItem('userName') || 'کاربر';
            const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
            avatar.innerHTML = `<span style="font-size: 1.5rem; font-weight: bold;">${initials}</span>`;
        }
    });
}

// ==================== توابع فرم‌ها ====================

// مدیریت ارسال فرم
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formId = form.id || form.getAttribute('id');
    
    // اعتبارسنجی فرم
    if (!validateForm(form)) {
        showToast('لطفاً فیلدهای ضروری را به درستی پر کنید', 'error');
        return;
    }
    
    // نمایش لودینگ
    showLoading();
    
    // ارسال فرم
    submitForm(formId, new FormData(form));
}

// اعتبارسنجی فرم
function validateForm(form) {
    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showInputError(input, 'این فیلد اجباری است');
        } else {
            clearInputError(input);
            
            // اعتبارسنجی خاص
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    showInputError(input, 'لطفاً ایمیل معتبر وارد کنید');
                }
            }
            
            if (input.type === 'tel') {
                const phoneRegex = /^09\d{9}$/;
                if (!phoneRegex.test(input.value.replace(/\D/g, ''))) {
                    isValid = false;
                    showInputError(input, 'لطفاً شماره موبایل معتبر وارد کنید');
                }
            }
            
            if (input.type === 'password') {
                if (input.value.length < 8) {
                    isValid = false;
                    showInputError(input, 'رمز عبور باید حداقل ۸ کاراکتر باشد');
                }
            }
        }
    });
    
    // اعتبارسنجی تطابق رمز عبور
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
        isValid = false;
        showInputError(confirmPassword, 'رمز عبور و تکرار آن مطابقت ندارند');
    }
    
    return isValid;
}

// نمایش خطای ورودی
function showInputError(input, message) {
    input.classList.add('is-invalid');
    
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
        errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// پاک کردن خطای ورودی
function clearInputError(input) {
    input.classList.remove('is-invalid');
    
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('invalid-feedback')) {
        errorElement.style.display = 'none';
    }
}

// اعتبارسنجی فیلد
function validateInput(event) {
    const input = event.target;
    const value = input.value.trim();
    
    if (input.hasAttribute('required') && !value) {
        showInputError(input, 'این فیلد اجباری است');
        return;
    }
    
    clearInputError(input);
}

// پاک کردن اعتبارسنجی
function clearValidation(event) {
    const input = event.target;
    clearInputError(input);
}

// ارسال فرم
async function submitForm(formId, formData) {
    try {
        let response;
        
        switch(formId) {
            case 'loginForm':
                response = await handleLogin(formData);
                break;
            case 'registerForm':
                response = await handleRegister(formData);
                break;
            case 'profileForm':
                response = await handleProfileUpdate(formData);
                break;
            case 'passwordForm':
                response = await handlePasswordChange(formData);
                break;
            case 'bookingForm':
                response = await handleBookingSubmit(formData);
                break;
            case 'paymentForm':
                response = await handlePayment(formData);
                break;
            default:
                response = { success: true, message: 'اطلاعات با موفقیت ذخیره شد' };
        }
        
        if (response.success) {
            showToast(response.message, 'success');
            
            if (response.redirect) {
                setTimeout(() => {
                    window.location.href = response.redirect;
                }, 1500);
            }
        } else {
            showToast(response.message, 'error');
        }
    } catch (error) {
        showToast('خطا در ارسال اطلاعات. لطفاً مجدداً تلاش کنید', 'error');
        console.error('Form submission error:', error);
    } finally {
        hideLoading();
    }
}

// مدیریت لاگین
async function handleLogin(formData) {
    // شبیه‌سازی لاگین
    return new Promise((resolve) => {
        setTimeout(() => {
            const email = formData.get('email');
            const password = formData.get('password');
            
            // در حالت واقعی این اطلاعات باید از سرور دریافت شود
            const mockUsers = {
                'admin@smartfithub.com': { role: 'admin', name: 'مدیر سیستم' },
                'coach@smartfithub.com': { role: 'coach', name: 'مربی نمونه' },
                'athlete@smartfithub.com': { role: 'athlete', name: 'ورزشکار نمونه' }
            };
            
            if (email in mockUsers && password === '12345678') {
                const user = mockUsers[email];
                
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', user.name);
                
                resolve({
                    success: true,
                    message: 'ورود موفقیت‌آمیز بود!',
                    redirect: `${user.role}-dashboard.html`
                });
            } else {
                resolve({
                    success: false,
                    message: 'ایمیل یا رمز عبور نادرست است'
                });
            }
        }, 1000);
    });
}

// مدیریت ثبت‌نام
async function handleRegister(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const email = formData.get('email');
            const name = formData.get('name');
            const phone = formData.get('phone');
            const role = formData.get('role') || 'athlete';
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);
            localStorage.setItem('userPhone', phone);
            localStorage.setItem('registrationDate', new Date().toLocaleDateString('fa-IR'));
            
            resolve({
                success: true,
                message: 'ثبت‌نام موفقیت‌آمیز بود! ایمیل تایید ارسال شد.',
                redirect: `${role}-dashboard.html`
            });
        }, 1500);
    });
}

// مدیریت بروزرسانی پروفایل
async function handleProfileUpdate(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const name = formData.get('name');
            const phone = formData.get('phone');
            const birthDate = formData.get('birthDate');
            const gender = formData.get('gender');
            
            localStorage.setItem('userName', name);
            if (phone) localStorage.setItem('userPhone', phone);
            if (birthDate) localStorage.setItem('userBirthDate', birthDate);
            if (gender) localStorage.setItem('userGender', gender);
            
            resolve({
                success: true,
                message: 'پروفایل با موفقیت به‌روزرسانی شد'
            });
        }, 1000);
    });
}

// مدیریت تغییر رمز عبور
async function handlePasswordChange(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const currentPassword = formData.get('currentPassword');
            const newPassword = formData.get('newPassword');
            
            // در حالت واقعی باید با سرور چک شود
            resolve({
                success: true,
                message: 'رمز عبور با موفقیت تغییر یافت'
            });
        }, 1000);
    });
}

// ==================== توابع داشبورد ====================

// بارگذاری داده‌های اولیه
function loadInitialData() {
    if (!isUserLoggedIn()) return;
    
    loadUserStats();
    loadClasses();
    loadCoaches();
    loadNotifications();
    loadWorkoutPlans();
    loadPaymentInfo();
}

// بارگذاری آمار کاربر
function loadUserStats() {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole === 'athlete') {
        updateAthleteStats();
    } else if (userRole === 'coach') {
        updateCoachStats();
    } else if (userRole === 'admin') {
        updateAdminStats();
    }
}

// بروزرسانی آمار ورزشکار
function updateAthleteStats() {
    const stats = {
        activeStudents: '24',
        weeklyClasses: '12',
        monthlyEarnings: '8.5M',
        coachRating: '4.8',
        caloriesBurned: '2,450',
        workoutHours: '36',
        weightChange: '-3.5',
        streakDays: '14'
    };
    
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

// بروزرسانی آمار مربی
function updateCoachStats() {
    const stats = {
        activeStudents: '18',
        weeklyClasses: '8',
        monthlyEarnings: '12.5M',
        coachRating: '4.9',
        totalStudents: '24',
        totalEarnings: '52.5M',
        avgEarnings: '520,000'
    };
    
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

// بروزرسانی آمار مدیر
function updateAdminStats() {
    const stats = {
        totalUsers: '1,254',
        monthlyIncome: '25.4M',
        activeClasses: '48',
        activeCoaches: '18'
    };
    
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

// بارگذاری کلاس‌ها
function loadClasses() {
    const classes = [
        { id: 1, name: 'یوگای پیشرفته', time: '۷:۰۰ - ۸:۳۰ صبح', capacity: '۱۵/۲۰', trainer: 'سارا احمدی', type: 'yoga' },
        { id: 2, name: 'کراس فیت', time: '۱۷:۰۰ - ۱۸:۳۰ عصر', capacity: '۱۲/۱۵', trainer: 'علی کریمی', type: 'crossfit' },
        { id: 3, name: 'پیلاتس', time: '۱۰:۰۰ - ۱۱:۳۰ صبح', capacity: '۸/۱۰', trainer: 'فاطمه محمدی', type: 'pilates' },
        { id: 4, name: 'بدنسازی', time: '۱۹:۰۰ - ۲۰:۳۰ عصر', capacity: '۱۰/۱۲', trainer: 'محمد رضایی', type: 'bodybuilding' }
    ];
    
    displayClasses(classes);
}

// نمایش کلاس‌ها
function displayClasses(classes) {
    const container = document.getElementById('classesContainer');
    if (!container) return;
    
    container.innerHTML = classes.map(cls => `
        <div class="card class-card" data-category="${cls.type}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 class="card-title mb-1">${cls.name}</h5>
                        <p class="text-muted mb-0"><i class="fas fa-user-tie me-1"></i>${cls.trainer}</p>
                    </div>
                    <span class="badge ${cls.type === 'yoga' ? 'bg-success' : cls.type === 'crossfit' ? 'bg-warning' : 'bg-primary'}">
                        ${cls.type === 'yoga' ? 'یوگا' : cls.type === 'crossfit' ? 'کراس فیت' : 'بدنسازی'}
                    </span>
                </div>
                
                <div class="row mb-3">
                    <div class="col-6">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-clock text-primary me-2"></i>
                            <span>${cls.time}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-users text-primary me-2"></i>
                            <span>${cls.capacity} نفر</span>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary w-100 book-btn" data-class-id="${cls.id}">
                    <i class="fas fa-ticket-alt me-2"></i>رزرو کلاس
                </button>
            </div>
        </div>
    `).join('');
}

// بارگذاری مربیان
function loadCoaches() {
    const coaches = [
        { id: 1, name: 'محمد رضایی', specialty: 'بدنسازی', rating: 4.8, experience: '۱۰ سال', students: 45 },
        { id: 2, name: 'سارا احمدی', specialty: 'یوگا', rating: 5.0, experience: '۸ سال', students: 32 },
        { id: 3, name: 'علی کریمی', specialty: 'کراس فیت', rating: 4.5, experience: '۶ سال', students: 28 }
    ];
    
    displayCoaches(coaches);
}

// نمایش مربیان
function displayCoaches(coaches) {
    const container = document.getElementById('coachesContainer');
    if (!container) return;
    
    container.innerHTML = coaches.map(coach => `
        <div class="card coach-card">
            <div class="card-body text-center">
                <div class="avatar avatar-xl mx-auto mb-3">
                    <span>${coach.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                
                <h5 class="card-title">${coach.name}</h5>
                <p class="text-muted mb-2">مربی ${coach.specialty}</p>
                
                <div class="mb-3">
                    ${generateStarRating(coach.rating)}
                    <span class="text-muted ms-2">${coach.rating} (${coach.experience} سابقه)</span>
                </div>
                
                <div class="d-flex justify-content-around mb-3">
                    <div class="text-center">
                        <div class="h5 mb-0">${coach.students}</div>
                        <small class="text-muted">شاگرد</small>
                    </div>
                    <div class="text-center">
                        <div class="h5 mb-0">${Math.floor(coach.rating * 20)}%</div>
                        <small class="text-muted">رضایت</small>
                    </div>
                </div>
                
                <button class="btn btn-outline-primary w-100 book-session-btn" data-coach-id="${coach.id}">
                    <i class="fas fa-calendar me-2"></i>رزرو جلسه
                </button>
            </div>
        </div>
    `).join('');
}

// تولید ستاره‌های امتیاز
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }
    
    return stars;
}

// ==================== توابع سیستم ====================

// تغییر زبان
function changeLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem('preferredLang', lang);
    showToast(lang === 'fa' ? 'زبان به فارسی تغییر یافت' : 'Language changed to English', 'info');
}

// تنظیم زبان
function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        if (button.dataset.lang === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// تغییر تم
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(newTheme === 'dark' ? 'تم تاریک فعال شد' : 'تم روشن فعال شد', 'info');
}

// تنظیم تم
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }
}

// تنظیم منطقه زمانی
function setTimezone() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    localStorage.setItem('timezone', timezone);
}

// تنظیم toastr
function initToastr() {
    if (typeof toastr !== 'undefined') {
        toastr.options = {
            "closeButton": true,
            "progressBar": true,
            "positionClass": "toast-top-left",
            "rtl": true,
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    }
}

// نمایش پیام
function showToast(message, type = 'info') {
    // اگر toastr وجود دارد از آن استفاده کن
    if (typeof toastr !== 'undefined') {
        toastr[type](message);
        return;
    }
    
    // ایجاد toast داخلی
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        min-width: 300px;
        border-right: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        animation: slideInRight 0.3s ease-out;
    `;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 type === 'warning' ? 'exclamation-triangle' : 'info-circle';
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${icon} text-${type} me-2"></i>
            <span>${message}</span>
            <button class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// ==================== توابع نمودارها ====================

// راه‌اندازی نمودارها
function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    // تنظیم فونت پیش‌فرض برای نمودارها
    Chart.defaults.font.family = "'Vazirmatn', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--dark-color');
    
    // ایجاد نمودارها
    createProgressChart();
    createLevelChart();
    createAttendanceChart();
    createEarningsChart();
}

// ایجاد نمودار پیشرفت
function createProgressChart() {
    const ctx = document.getElementById('studentProgressChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['مهر', 'آبان', 'آذر'],
            datasets: [
                {
                    label: 'میانگین پیشرفت',
                    data: [65, 72, 78],
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'بهترین شاگرد',
                    data: [78, 85, 92],
                    borderColor: '#4fc3a1',
                    backgroundColor: 'rgba(79, 195, 161, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    rtl: true,
                    labels: {
                        font: {
                            family: "'Vazirmatn', sans-serif"
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100
                }
            }
        }
    });
}

// ایجاد نمودار سطح
function createLevelChart() {
    const ctx = document.getElementById('studentLevelChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['مبتدی', 'متوسط', 'پیشرفته'],
            datasets: [{
                data: [8, 10, 6],
                backgroundColor: ['#3498db', '#9b59b6', '#2ecc71'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true
                }
            }
        }
    });
}

// ==================== توابع رزرو ====================

// مدیریت رزرو
function handleBooking(button) {
    if (!isUserLoggedIn()) {
        showLoginModal();
        return;
    }
    
    const classId = button.dataset.classId || button.dataset.coachId;
    const type = button.classList.contains('book-btn') ? 'class' : 'session';
    
    showBookingModal(classId, type);
}

// نمایش مدال رزرو
function showBookingModal(itemId, type) {
    const modalHTML = `
        <div class="modal show" id="bookingModal" data-dynamic="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${type === 'class' ? 'رزرو کلاس' : 'رزرو جلسه خصوصی'}</h5>
                        <button type="button" class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="bookingForm">
                            <div class="form-group">
                                <label for="bookingDate" class="form-label">تاریخ:</label>
                                <input type="date" id="bookingDate" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="bookingTime" class="form-label">ساعت:</label>
                                <select id="bookingTime" class="form-control" required>
                                    <option value="">انتخاب ساعت</option>
                                    <option value="07:00">۷:۰۰ صبح</option>
                                    <option value="08:00">۸:۰۰ صبح</option>
                                    <option value="17:00">۵:۰۰ عصر</option>
                                    <option value="18:00">۶:۰۰ عصر</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="notes" class="form-label">توضیحات (اختیاری):</label>
                                <textarea id="notes" class="form-control" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-close">انصراف</button>
                        <button type="button" class="btn btn-primary" onclick="submitBooking()">تایید رزرو</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ارسال رزرو
async function submitBooking() {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    
    if (!date || !time) {
        showToast('لطفاً تاریخ و ساعت را انتخاب کنید', 'error');
        return;
    }
    
    showLoading();
    
    try {
        // شبیه‌سازی ارسال به سرور
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        closeModal();
        showToast('رزرو شما با موفقیت ثبت شد! پیامک تایید ارسال خواهد شد.', 'success');
        
        // رفرش لیست کلاس‌ها
        loadClasses();
    } catch (error) {
        showToast('خطا در ثبت رزرو. لطفاً مجدداً تلاش کنید', 'error');
    } finally {
        hideLoading();
    }
}

// ==================== توابع چت ====================

// راه‌اندازی چت
function initChat() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    // بارگذاری تاریخچه چت
    loadChatHistory();
}

// ارسال پیام
function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    
    if (!input || !messages) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // اضافه کردن پیام کاربر
    addMessage(message, 'sent', 'شما');
    
    // شبیه‌سازی پاسخ ربات
    setTimeout(() => {
        const responses = [
            'متوجه شدم. در جلسه بعدی بیشتر تمرکز می‌کنیم.',
            'عالی! ادامه بدید.',
            'لطفاً تغذیه رو هم رعایت کنید.',
            'برنامه جدید رو براتون آماده کردم.',
            'فردا جلسه خصوصی داریم، یادتون نره.'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'received', 'مربی');
    }, 1000);
    
    input.value = '';
}

// اضافه کردن پیام
function addMessage(text, type, sender) {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;
    
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-header">
            <strong>${sender}</strong>
            <small>${time}</small>
        </div>
        <div class="message-body">${text}</div>
    `;
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// بارگذاری تاریخچه چت
function loadChatHistory() {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;
    
    // پیام‌های نمونه
    const sampleMessages = [
        { text: 'سلام! جلسه امروز چطور بود؟', type: 'received', sender: 'مربی', time: '14:30' },
        { text: 'سلام مربی! عالی بود. احساس می‌کنم پیشرفت داشتم.', type: 'sent', sender: 'شما', time: '14:32' },
        { text: 'خوشحالم که پیشرفت دارید. یادتون باشه تمرینات کششی رو حتما انجام بدید.', type: 'received', sender: 'مربی', time: '14:35' }
    ];
    
    sampleMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.type}`;
        messageDiv.innerHTML = `
            <div class="message-header">
                <strong>${msg.sender}</strong>
                <small>${msg.time}</small>
            </div>
            <div class="message-body">${msg.text}</div>
        `;
        messages.appendChild(messageDiv);
    });
    
    messages.scrollTop = messages.scrollHeight;
}

// ==================== توابع کمکی ====================

// نمایش لودینگ
function showLoading() {
    const loadingHTML = `
        <div class="loading-overlay">
            <div class="spinner"></div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

// مخفی کردن لودینگ
function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// باز کردن مدال
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

// بستن مدال
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    
    // حذف مدال‌های داینامیک
    const dynamicModals = document.querySelectorAll('.modal[data-dynamic="true"]');
    dynamicModals.forEach(modal => modal.remove());
}

// منوی موبایل
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// بررسی لاگین کاربر
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// نمایش مدال لاگین
function showLoginModal() {
    showToast('برای ادامه لطفاً وارد شوید', 'warning');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// رفرش داده‌ها
function refreshData() {
    if (!isUserLoggedIn()) return;
    
    // فقط اگر کاربر در صفحات داشبورد باشد
    const currentPage = window.location.pathname.split('/').pop();
    const dashboardPages = ['dashboard.html', 'coach-dashboard.html', 'admin-dashboard.html'];
    
    if (dashboardPages.includes(currentPage)) {
        console.log('🔄 Refreshing dashboard data...');
        loadUserStats();
        loadNotifications();
    }
}

// خروج از سیستم
function logout() {
    if (confirm('آیا می‌خواهید از حساب کاربری خود خارج شوید؟')) {
        // پاک کردن اطلاعات لاگین
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhone');
        
        showToast('با موفقیت خارج شدید', 'success');
        
        // ریدایرکت به صفحه اصلی
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// ==================== توابع مدیریت خطا ====================

// مدیریت خطاهای جهانی
window.addEventListener('error', function(event) {
    console.error('❌ Error:', event.error);
    showToast('خطایی رخ داده است. لطفاً صفحه را رفرش کنید.', 'error');
});

// وضعیت آنلاین/آفلاین
window.addEventListener('online', function() {
    showToast('اتصال اینترنت برقرار شد', 'success');
    refreshData();
});

window.addEventListener('offline', function() {
    showToast('اتصال اینترنت قطع شد. حالت آفلاین فعال شد', 'warning');
});

// قبل از بسته شدن صفحه
window.addEventListener('beforeunload', function(event) {
    const scrollPosition = window.scrollY;
    localStorage.setItem('scrollPosition', scrollPosition);
});

// بعد از لود شدن صفحه
window.addEventListener('load', function() {
    // بازیابی موقعیت اسکرول
    const savedPosition = localStorage.getItem('scrollPosition');
    if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
        localStorage.removeItem('scrollPosition');
    }
});
// SMART FIT - اسکریپت‌های اصلی برنامه

// اعتبارسنجی فرم لاگین
function validateLoginForm(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const captchaAnswer = document.getElementById('captcha-answer')?.value;
    
    // اعتبارسنجی اولیه
    if (!email || !password) {
        showAlert('لطفاً ایمیل و رمز عبور را وارد کنید', 'danger');
        return false;
    }
    
    if (!validateEmail(email)) {
        showAlert('ایمیل وارد شده معتبر نیست', 'warning');
        return false;
    }
    
    // اعتبارسنجی کپچا
    if (smartFitCaptcha && captchaAnswer) {
        const captchaValidation = smartFitCaptcha.validateAnswer(captchaAnswer);
        
        if (!captchaValidation.valid) {
            showAlert(captchaValidation.message, 'danger');
            smartFitCaptcha.generateQuestion();
            document.getElementById('captcha-answer').value = '';
            return false;
        }
    } else {
        showAlert('لطفاً تایید امنیتی را کامل کنید', 'warning');
        return false;
    }
    
    // شبیه‌سازی بررسی اعتبار کاربر
    showAlert('در حال بررسی اطلاعات...', 'info');
    
    setTimeout(() => {
        // ذخیره اطلاعات کاربر موقتاً
        const tempUser = {
            email: email,
            phone: '09123456789', // در ریل از دیتابیس میاد
            name: 'کاربر نمونه'
        };
        
        localStorage.setItem('smartfit_temp_user', JSON.stringify(tempUser));
        
        // هدایت به صفحه احراز هویت دو مرحله‌ای
        window.location.href = 'pages/verify-2fa.html';
    }, 1500);
    
    return false;
}

// اعتبارسنجی فرم ثبت‌نام
function validateRegisterForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // اعتبارسنجی
    if (!name || !email || !password || !confirmPassword) {
        showAlert('لطفاً تمام فیلدها را پر کنید', 'danger');
        return false;
    }
    
    if (!validateEmail(email)) {
        showAlert('ایمیل وارد شده معتبر نیست', 'warning');
        return false;
    }
    
    if (password.length < 6) {
        showAlert('رمز عبور باید حداقل ۶ کاراکتر باشد', 'warning');
        return false;
    }
    
    if (password !== confirmPassword) {
        showAlert('رمز عبور و تکرار آن یکسان نیستند', 'danger');
        return false;
    }
    
    // شبیه‌سازی ثبت‌نام موفق
    showAlert('ثبت‌نام موفقیت‌آمیز بود! به صفحه ورود هدایت می‌شوید...', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
    
    return false;
}

// اعتبارسنجی ایمیل
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// نمایش پیام
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // قرار دادن در بالای صفحه
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    // حذف خودکار بعد از ۵ ثانیه
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// مدیریت داشبورد
function initializeDashboard() {
    console.log('داشبورد SMART FIT بارگذاری شد');
    
    // شبیه‌سازی داده‌های نمودار
    if (typeof Chart !== 'undefined') {
        initializeProgressChart();
    }
    
    // بارگذاری اطلاعات کاربر
    loadUserData();
}

// نمودار پیشرفت
function initializeProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['هفته ۱', 'هفته ۲', 'هفته ۳', 'هفته ۴', 'هفته ۵', 'هفته ۶'],
            datasets: [{
                label: 'پیشرفت تناسب اندام',
                data: [65, 70, 75, 80, 85, 90],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    rtl: true,
                    labels: {
                        font: {
                            family: 'Vazirmatn'
                        }
                    }
                }
            }
        }
    });
}

// بارگذاری اطلاعات کاربر
function loadUserData() {
    // شبیه‌سازی داده کاربر
    const userData = {
        name: 'کاربر SMART FIT',
        level: 'متوسط',
        goal: 'کاهش وزن',
        workoutsCompleted: 24,
        streakDays: 15,
        calorieGoal: 2000,
        waterGoal: 8
    };
    
    // نمایش در داشبورد
    const elements = {
        'user-name': userData.name,
        'user-level': userData.level,
        'user-goal': userData.goal,
        'workouts-count': userData.workoutsCompleted,
        'streak-days': userData.streakDays,
        'calorie-goal': userData.calorieGoal,
        'water-goal': userData.waterGoal
    };
    
    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

// مدیریت وضعیت لاگین
function checkLoginStatus() {
    const token = localStorage.getItem('smartfit_token');
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    
    if (token && userMenu) {
        loginBtn.style.display = 'none';
        userMenu.style.display = 'block';
    }
}

// خروج از حساب
function logout() {
    localStorage.removeItem('smartfit_token');
    window.location.href = 'index.html';
}

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    console.log('SMART FIT Application Loaded');
    
    // چک وضعیت لاگین
    checkLoginStatus();
    
    // راه‌اندازی فرم‌ها
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', validateLoginForm);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', validateRegisterForm);
    }
    
    // راه‌اندازی داشبورد
    if (window.location.pathname.includes('dashboard')) {
        initializeDashboard();
    }
    
    // انیمیشن اسکرول
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
// سیستم کپچای ریاضی
class MathCaptcha {
    constructor() {
        this.num1 = 0;
        this.num2 = 0;
        this.operator = '+';
        this.answer = 0;
        this.timer = 60;
        this.timerInterval = null;
    }

    generateQuestion() {
        // تولید اعداد تصادفی
        this.num1 = Math.floor(Math.random() * 10) + 1;
        this.num2 = Math.floor(Math.random() * 10) + 1;
        
        // انتخاب عملگر تصادفی
        const operators = ['+', '-', '×'];
        this.operator = operators[Math.floor(Math.random() * operators.length)];
        
        // محاسبه جواب
        switch(this.operator) {
            case '+':
                this.answer = this.num1 + this.num2;
                break;
            case '-':
                // مطمئن شویم جواب منفی نباشد
                if (this.num1 < this.num2) {
                    [this.num1, this.num2] = [this.num2, this.num1];
                }
                this.answer = this.num1 - this.num2;
                break;
            case '×':
                this.answer = this.num1 * this.num2;
                // محدود کردن به اعداد کوچک‌تر
                if (this.answer > 20) {
                    this.num1 = Math.floor(Math.random() * 4) + 1;
                    this.num2 = Math.floor(Math.random() * 4) + 1;
                    this.answer = this.num1 * this.num2;
                }
                break;
        }
        
        // نمایش سوال
        const questionElement = document.getElementById('captcha-question');
        if (questionElement) {
            questionElement.innerHTML = `
                <span class="display-6">${this.num1}</span>
                <span class="mx-3">${this.operator}</span>
                <span class="display-6">${this.num2}</span>
                <span class="mx-2">=</span>
                <span class="text-muted">؟</span>
            `;
        }
        
        // ریست تایمر
        this.resetTimer();
    }

    resetTimer() {
        this.timer = 60;
        const timerElement = document.getElementById('captcha-timer');
        if (timerElement) {
            timerElement.textContent = this.timer;
            timerElement.className = 'badge bg-warning';
        }
        
        // پاک کردن تایمر قبلی
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // شروع تایمر جدید
        this.timerInterval = setInterval(() => {
            this.timer--;
            
            if (timerElement) {
                timerElement.textContent = this.timer;
                
                // تغییر رنگ با کاهش زمان
                if (this.timer <= 10) {
                    timerElement.className = 'badge bg-danger';
                } else if (this.timer <= 30) {
                    timerElement.className = 'badge bg-warning';
                }
                
                // پایان زمان
                if (this.timer <= 0) {
                    clearInterval(this.timerInterval);
                    this.generateQuestion(); // تولید سوال جدید
                    showAlert('زمان تایید امنیتی به پایان رسید. سوال جدید تولید شد.', 'warning');
                }
            }
        }, 1000);
    }

    validateAnswer(userAnswer) {
        const numericAnswer = parseInt(userAnswer);
        
        if (isNaN(numericAnswer)) {
            return { valid: false, message: 'لطفاً یک عدد وارد کنید' };
        }
        
        if (numericAnswer === this.answer) {
            return { valid: true, message: 'کپچا تأیید شد' };
        } else {
            return { valid: false, message: 'پاسخ نادرست است' };
        }
    }
}

// ایجاد نمونه کپچا
let smartFitCaptcha = null;

// راه‌اندازی کپچا
function initializeCaptcha() {
    smartFitCaptcha = new MathCaptcha();
    smartFitCaptcha.generateQuestion();
    
    // دکمه تازه‌سازی کپچا
    const refreshBtn = document.getElementById('refresh-captcha');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            smartFitCaptcha.generateQuestion();
            showAlert('سوال امنیتی جدید تولید شد', 'info');
        });
    }
}

// آپدیت validateLoginForm برای شامل کردن کپچا:
function validateLoginForm(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const captchaAnswer = document.getElementById('captcha-answer')?.value;
    
    // اعتبارسنجی اولیه
    if (!email || !password) {
        showAlert('لطفاً ایمیل و رمز عبور را وارد کنید', 'danger');
        return false;
    }
    
    if (!validateEmail(email)) {
        showAlert('ایمیل وارد شده معتبر نیست', 'warning');
        return false;
    }
    
    // اعتبارسنجی کپچا
    if (smartFitCaptcha && captchaAnswer) {
        const captchaValidation = smartFitCaptcha.validateAnswer(captchaAnswer);
        
        if (!captchaValidation.valid) {
            showAlert(captchaValidation.message, 'danger');
            smartFitCaptcha.generateQuestion(); // تولید سوال جدید
            document.getElementById('captcha-answer').value = '';
            return false;
        }
    } else {
        showAlert('لطفاً تایید امنیتی را کامل کنید', 'warning');
        return false;
    }
    
    // شبیه‌سازی لاگین موفق
    showAlert('ورود موفقیت‌آمیز بود! در حال انتقال به داشبورد...', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
    
    return false;
}
// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    console.log('SMART FIT Application Loaded');
    
    // راه‌اندازی کپچا (اگر صفحه لاگین باشد)
    const captchaElement = document.getElementById('captcha-question');
    if (captchaElement) {
        initializeCaptcha();
    }
    
    // سیستم تأیید شماره تلفن
class PhoneVerification {
    constructor() {
        this.verificationCode = '';
        this.isVerified = false;
    }
    
    sendVerificationCode(phoneNumber) {
        // در ریل: به سرور درخواست می‌دهیم کد SMS بفرسته
        // در پروژه: شبیه‌سازی می‌کنیم
        
        // تولید کد ۶ رقمی
        this.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        this.isVerified = false;
        
        console.log('کد تأیید برای', phoneNumber, ':', this.verificationCode);
        
        // شبیه‌سازی ارسال SMS
        showAlert(`کد تأیید به شماره ${phoneNumber} ارسال شد`, 'info');
        
        // نمایش بخش وارد کردن کد
        document.getElementById('verification-code-section').style.display = 'block';
        
        return true;
    }
    
    verifyCode(enteredCode) {
        if (enteredCode === this.verificationCode) {
            this.isVerified = true;
            showAlert('شماره تلفن با موفقیت تأیید شد', 'success');
            return true;
        } else {
            showAlert('کد تأیید نادرست است', 'danger');
            return false;
        }
    }
}

// ایجاد نمونه
let phoneVerifier = null;

// آپدیت validateRegisterForm
function validateRegisterForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const phone = document.getElementById('phone')?.value;
    const verificationCode = document.getElementById('verification-code')?.value;
    
    // اعتبارسنجی اولیه
    if (!name || !email || !password || !confirmPassword || !phone) {
        showAlert('لطفاً تمام فیلدهای ضروری را پر کنید', 'danger');
        return false;
    }
    
    if (!validateEmail(email)) {
        showAlert('ایمیل وارد شده معتبر نیست', 'warning');
        return false;
    }
    
    if (password.length < 6) {
        showAlert('رمز عبور باید حداقل ۶ کاراکتر باشد', 'warning');
        return false;
    }
    
    if (password !== confirmPassword) {
        showAlert('رمز عبور و تکرار آن یکسان نیستند', 'danger');
        return false;
    }
    
    // اعتبارسنجی شماره تلفن
    if (!validatePhone(phone)) {
        showAlert('شماره تلفن معتبر نیست (09xxxxxxxxx)', 'warning');
        return false;
    }
    
    // تأیید کد (اگر ارسال شده)
    if (phoneVerifier && verificationCode) {
        if (!phoneVerifier.verifyCode(verificationCode)) {
            return false;
        }
    } else {
        showAlert('لطفاً شماره تلفن خود را تأیید کنید', 'warning');
        return false;
    }
    
    // شبیه‌سازی ثبت‌نام موفق
    showAlert('ثبت‌نام موفقیت‌آمیز بود! به صفحه ورود هدایت می‌شوید...', 'success');
    
    // ذخیره اطلاعات کاربر
    const userData = {
        name: name,
        email: email,
        phone: phone,
        verified: true,
        registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('smartfit_user_data', JSON.stringify(userData));
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
    
    return false;
}

// اعتبارسنجی شماره تلفن
function validatePhone(phone) {
    const regex = /^09[0-9]{9}$/;
    return regex.test(phone);
}

// راه‌اندازی در register.html
function initializeRegistration() {
    phoneVerifier = new PhoneVerification();
    
    // دکمه ارسال کد
    const sendBtn = document.getElementById('send-verification');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const phone = document.getElementById('phone').value;
            
            if (!validatePhone(phone)) {
                showAlert('لطفاً شماره تلفن معتبر وارد کنید', 'warning');
                return;
            }
            
            phoneVerifier.sendVerificationCode(phone);
        });
    }
}
});