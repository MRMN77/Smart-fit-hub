(function() {
    'use strict';
    
    console.log('🚀 SMART-FIT Navigation System Activated');
    
    // ==================== تنظیمات ====================
    const CONFIG = {
        // نقش‌های سیستم
        ROLES: {
            ATHLETE: { key: 'athlete', name: 'ورزشکار', dashboard: 'dashboard.html' },
            COACH: { key: 'coach', name: 'مربی', dashboard: 'coach-dashboard.html' },
            ADMIN: { key: 'admin', name: 'مدیر', dashboard: 'admin-dashboard.html' }
        },
        
        // اطلاعات پیش‌فرض برای دمو
        DEMO_USERS: {
            athlete: { email: 'test@smartfit.ir', password: '123456' },
            coach: { email: 'coach@smartfit.ir', password: '123456' },
            admin: { email: 'admin@smartfit.ir', password: 'Admin@123' }
        }
    };
    
    // ==================== سیستم ذخیره‌سازی ====================
    const Storage = {
        setUser: function(userData) {
            const data = {
                ...userData,
                loginTime: new Date().toISOString(),
                sessionId: 'demo-' + Math.random().toString(36).substr(2, 9)
            };
            localStorage.setItem('smartfit_user', JSON.stringify(data));
            return data;
        },
        
        getUser: function() {
            const data = localStorage.getItem('smartfit_user');
            return data ? JSON.parse(data) : null;
        },
        
        clearUser: function() {
            localStorage.removeItem('smartfit_user');
        },
        
        setRole: function(role) {
            localStorage.setItem('smartfit_role', role);
        },
        
        getRole: function() {
            return localStorage.getItem('smartfit_role') || 'athlete';
        }
    };
    
    // ==================== سیستم ناوبری ====================
    const Navigation = {
        // هدایت به صفحه با تاخیر و انیمیشن
        redirectTo: function(pagePath, delay = 800) {
            console.log(`🔗 هدایت به: ${pagePath}`);
            
            // نمایش پیام زیبا (اگر jQuery UI یا SweetAlert موجود باشد)
            this.showLoadingMessage();
            
            setTimeout(() => {
                window.location.href = pagePath;
            }, delay);
        },
        
        // هدایت بر اساس نقش
        redirectByRole: function(roleKey) {
            const role = CONFIG.ROLES[roleKey.toUpperCase()] || CONFIG.ROLES.ATHLETE;
            this.redirectTo(`../pages/${role.dashboard}`);
        },
        
        // نمایش پیام بارگذاری
        showLoadingMessage: function() {
            // اگر jQuery UI وجود دارد
            if (typeof $ !== 'undefined' && $.ui) {
                $('<div>')
                    .html('<h4>در حال انتقال...</h4><p>لطفاً چند لحظه صبر کنید</p>')
                    .dialog({ modal: true, title: 'SMART FIT' });
            } 
            // اگر SweetAlert2 وجود دارد
            else if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'لطفاً صبر کنید',
                    html: 'در حال انتقال به صفحه مورد نظر...',
                    timer: 800,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
            }
            // پیام ساده
            else {
                console.log('⏳ در حال انتقال...');
            }
        }
    };
    
    // ==================== سیستم فرم‌ها ====================
    const FormHandler = {
        // ثبت‌نام
        setupRegisterForm: function() {
            const form = document.querySelector('form[action*="register"], form[action="#"]');
            if (!form) return;
            
            // اگر انتخابگر نقش وجود ندارد، اضافه کن
            if (!document.getElementById('userRole')) {
                this.addRoleSelector(form);
            }
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // دریافت نقش
                const roleSelect = document.getElementById('userRole');
                const role = roleSelect ? roleSelect.value : 'athlete';
                
                // ذخیره کاربر
                const userData = {
                    email: form.querySelector('[type="email"]')?.value || 'demo@smartfit.ir',
                    name: form.querySelector('[name="name"]')?.value || 'کاربر دمو',
                    role: role,
                    registeredAt: new Date().toLocaleDateString('fa-IR')
                };
                
                Storage.setUser(userData);
                Storage.setRole(role);
                
                // هدایت
                Navigation.redirectByRole(role);
            });
            
            console.log('✅ فرم ثبت‌نام فعال شد');
        },
        
        // ورود
        setupLoginForm: function() {
            const forms = document.querySelectorAll('form[action*="login"], form[action="#"]');
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    // تشخیص نوع صفحه ورود
                    const isAdminPage = window.location.pathname.includes('login-admin');
                    const isCoachPage = window.location.pathname.includes('coach');
                    
                    let role = 'athlete';
                    if (isAdminPage) role = 'admin';
                    else if (isCoachPage) role = 'coach';
                    
                    // استفاده از اطلاعات دمو
                    const demoUser = CONFIG.DEMO_USERS[role] || CONFIG.DEMO_USERS.athlete;
                    
                    const userData = {
                        email: demoUser.email,
                        name: role === 'athlete' ? 'کاربر تست' : 
                              role === 'coach' ? 'مربی نمونه' : 'مدیر سیستم',
                        role: role,
                        isDemo: true
                    };
                    
                    Storage.setUser(userData);
                    Storage.setRole(role);
                    
                    // هدایت
                    Navigation.redirectByRole(role);
                });
            });
            
            console.log(`✅ ${forms.length} فرم ورود فعال شد`);
        },
        
        // اضافه کردن انتخابگر نقش به فرم
        addRoleSelector: function(form) {
            const roleHtml = `
                <div class="mb-4" id="roleSelectorContainer">
                    <label class="form-label fw-bold">
                        <i class="fas fa-user-tag me-2"></i>انتخاب نقش:
                    </label>
                    <div class="btn-group w-100" role="group">
                        <input type="radio" class="btn-check" name="userRole" id="roleAthlete" value="athlete" checked>
                        <label class="btn btn-outline-primary" for="roleAthlete">
                            <i class="fas fa-user me-1"></i> ورزشکار
                        </label>
                        
                        <input type="radio" class="btn-check" name="userRole" id="roleCoach" value="coach">
                        <label class="btn btn-outline-success" for="roleCoach">
                            <i class="fas fa-dumbbell me-1"></i> مربی
                        </label>
                        
                        <input type="radio" class="btn-check" name="userRole" id="roleAdmin" value="admin">
                        <label class="btn btn-outline-danger" for="roleAdmin">
                            <i class="fas fa-crown me-1"></i> مدیر
                        </label>
                    </div>
                    <small class="form-text text-muted">
                        نقش خود را برای دسترسی به داشبورد مناسب انتخاب کنید
                    </small>
                </div>
            `;
            
            // قرار دادن قبل از دکمه ارسال
            const submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.insertAdjacentHTML('beforebegin', roleHtml);
            }
        }
    };
    
    // ==================== سیستم لینک‌ها ====================
    const LinkHandler = {
        // فعال‌سازی لینک‌های اصلی
        setupMainLinks: function() {
            // دکمه‌های صفحه اصلی
            const mainLinks = {
                // ثبت‌نام
                '.btn-primary, a[href*="#"]:contains("ثبت نام"), a[href*="#"]:contains("Register")': 'register.html',
                // ورود
                '.btn-outline-primary, a[href*="#"]:contains("ورود"), a[href*="#"]:contains("Login")': 'login.html',
                // شروع کنید
                '.btn-success, .btn-lg:contains("شروع کنید")': 'register.html'
            };
            
            Object.keys(mainLinks).forEach(selector => {
                document.querySelectorAll(selector).forEach(link => {
                    if (link.getAttribute('href') === '#') {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            Navigation.redirectTo(`pages/${mainLinks[selector]}`);
                        });
                    }
                });
            });
            
            console.log('✅ لینک‌های اصلی فعال شدند');
        },
        
        // اضافه کردن منوی کاربر در داشبورد
        addUserMenu: function() {
            const user = Storage.getUser();
            if (!user) return;
            
            // پیدا کردن ناوبری
            const navbars = document.querySelectorAll('.navbar, header, .user-info');
            navbars.forEach(nav => {
                const userMenuHtml = `
                    <div class="dropdown ms-3">
                        <button class="btn btn-outline-light dropdown-toggle" type="button" 
                                data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user-circle me-2"></i>
                            ${user.name || 'کاربر'}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><span class="dropdown-item-text">
                                <small class="text-muted">نقش: ${user.role === 'athlete' ? 'ورزشکار' : 
                                                         user.role === 'coach' ? 'مربی' : 'مدیر'}</small>
                            </span></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="../index.html">
                                <i class="fas fa-home me-2"></i>صفحه اصلی
                            </a></li>
                            <li><a class="dropdown-item" href="#" id="logoutBtn">
                                <i class="fas fa-sign-out-alt me-2"></i>خروج
                            </a></li>
                        </ul>
                    </div>
                `;
                
                nav.insertAdjacentHTML('beforeend', userMenuHtml);
                
                // مدیریت خروج
                document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    Storage.clearUser();
                    Navigation.redirectTo('../index.html', 300);
                });
            });
        }
    };
    
    // ==================== سیستم تشخیص صفحه ====================
    const PageDetector = {
        getCurrentPageType: function() {
            const path = window.location.pathname;
            const page = path.split('/').pop();
            
            return {
                isIndex: page === 'index.html' || page === '',
                isRegister: page.includes('register'),
                isLogin: page.includes('login'),
                isDashboard: page.includes('dashboard'),
                pageName: page
            };
        }
    };
    
    // ==================== مقداردهی اولیه ====================
    function init() {
        const pageInfo = PageDetector.getCurrentPageType();
        console.log(`📄 صفحه فعلی: ${pageInfo.pageName}`);
        
        // بر اساس صفحه فعلی، سیستم مناسب را فعال کن
        if (pageInfo.isIndex) {
            LinkHandler.setupMainLinks();
        } 
        else if (pageInfo.isRegister) {
            FormHandler.setupRegisterForm();
        }
        else if (pageInfo.isLogin) {
            FormHandler.setupLoginForm();
        }
        else if (pageInfo.isDashboard) {
            LinkHandler.addUserMenu();
            
            // نمایش اطلاعات کاربر در داشبورد
            const user = Storage.getUser();
            if (user) {
                console.log(`👤 کاربر وارد شده: ${user.name} (${user.role})`);
            } else {
                // اگر کاربر لاگین نکرده به صفحه اصلی برگردان
                setTimeout(() => {
                    Navigation.redirectTo('../index.html');
                }, 1500);
            }
        }
        
        // فعال‌سازی tooltip‌ها (اگر Bootstrap موجود باشد)
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }
    
    // ==================== اجرا ====================
    // صبر کن تا DOM کاملاً بارگذاری شود
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // در دسترس قرار دادن برای دیباگ
    window.SmartFit = {
        Storage,
        Navigation,
        FormHandler,
        LinkHandler,
        CONFIG
    };
    
})();