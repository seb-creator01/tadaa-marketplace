// ============================================
// TADAA! - CUSTOMER WEBSITE (COMPLETE)
// PREMIUM UI/UX ENHANCED VERSION
// ============================================

// ===== Firebase Config =====
const firebaseConfig = {
    apiKey: "AIzaSyDCXnlAqyt2512HlvBOsSfMZ6O-xg0c94Y",
    authDomain: "tadaa-marketplace.firebaseapp.com",
    projectId: "tadaa-marketplace",
    storageBucket: "tadaa-marketplace.firebasestorage.app",
    messagingSenderId: "56983478470",
    appId: "1:56983478470:web:0efdf7f44b19e88a6237c7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log('🛒 Tadaa! Customer Website Loaded');

// ============================================
// SPLASH SCREEN CONTROL
// ============================================

function hideSplashScreen() {
    const splash = document.getElementById('splashScreen');
    if (splash) {
        splash.classList.add('hidden');
        setTimeout(function() {
            splash.style.display = 'none';
        }, 800);
    }
}

function showContent() {
    hideSplashScreen();
}

// ============================================
// SVG ICONS
// ============================================
const Icons = {
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    cart: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
    shop: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    category: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    minus: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    truck: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    emptyCart: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
    arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    box: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    quality: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    fast: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 18 8.5 8 1 8"/><polyline points="17 18 17 11 9.5 11"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
    priceTag: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    mail: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    heartFilled: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    shoppingBag: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#FFD400" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
};

// ============================================
// DOM ELEMENTS
// ============================================
const appContainer = document.getElementById('app');
const mainHeader = document.getElementById('main-header');
const mainFooter = document.getElementById('main-footer');

// ============================================
// STATE
// ============================================
let products = [];
let categories = [];
let settings = {};
let cart = [];
let wishlist = [];
let currentCategory = 'all';
let searchTerm = '';

// ============================================
// OPTIMIZE CLOUDINARY IMAGES
// ============================================
function optimizeCloudinaryImage(url) {
    if (!url) return url;
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        const parts = url.split('/upload/');
        if (parts.length === 2) {
            return `${parts[0]}/upload/w_400,h_400,c_fill,q_auto,f_auto/${parts[1]}`;
        }
    }
    return url;
}

function optimizeCloudinaryImageLarge(url) {
    if (!url) return url;
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        const parts = url.split('/upload/');
        if (parts.length === 2) {
            return `${parts[0]}/upload/w_600,h_600,c_fill,q_auto,f_auto/${parts[1]}`;
        }
    }
    return url;
}

function optimizeCloudinaryImageCart(url) {
    if (!url) return url;
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        const parts = url.split('/upload/');
        if (parts.length === 2) {
            return `${parts[0]}/upload/w_100,h_100,c_fill,q_auto,f_auto/${parts[1]}`;
        }
    }
    return url;
}

function optimizeProductImages() {
    products.forEach(product => {
        if (product.images && product.images.length > 0) {
            product.images = product.images.map(img => optimizeCloudinaryImage(img));
        }
    });
}

// ============================================
// THEME TOGGLE
// ============================================
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (currentTheme === 'dark') {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (themeToggle) themeToggle.innerHTML = Icons.moon;
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeToggle) themeToggle.innerHTML = Icons.sun;
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.innerHTML = Icons.sun;
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggle) themeToggle.innerHTML = Icons.moon;
    }
}

// ============================================
// LOAD CART
// ============================================
function loadCart() {
    try {
        const saved = localStorage.getItem('tadaa_cart');
        if (saved) {
            cart = JSON.parse(saved);
            console.log('📦 Cart loaded:', cart.length, 'items');
        }
    } catch (e) {
        console.error('Error loading cart:', e);
        cart = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('tadaa_cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// ============================================
// SHOW MAINTENANCE PAGE
// ============================================
function showMaintenancePage() {
    console.log('🔧 Showing maintenance page');
    if (!appContainer) return;
    appContainer.innerHTML = `
        <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #000 0%, #1a1a1a 100%); padding:20px;">
            <div class="card card-glass" style="max-width:500px; width:100%; padding:48px 40px; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.5);">
                <div style="font-size:64px; margin-bottom:16px;">🔧</div>
                <h1 class="tadaa-title" style="font-size:32px; color:var(--text-primary); margin:0 0 8px;">Store Under Maintenance</h1>
                <p style="color:var(--text-secondary); font-size:18px; margin:0 0 8px;">We're currently updating our store.</p>
                <p style="color:var(--text-muted); font-size:14px; margin:0 0 24px;">Please check back soon!</p>
                <div style="background:var(--bg-input); border-radius:12px; padding:16px; text-align:left;">
                    <p style="margin:4px 0; color:var(--text-secondary); font-size:14px;"><strong>🕐 Business Hours:</strong> ${settings.businessHours || 'Mon-Fri: 9am - 6pm'}</p>
                    <p style="margin:4px 0; color:var(--text-secondary); font-size:14px;"><strong>📧 Contact:</strong> ${settings.storeEmail || 'support@tadaa.com'}</p>
                    <p style="margin:4px 0; color:var(--text-secondary); font-size:14px;"><strong>📞 Phone:</strong> ${settings.storePhone || '+2348012345678'}</p>
                </div>
                <div style="margin-top:20px; padding-top:20px; border-top:1px solid var(--border-color);">
                    <p style="color:var(--text-muted); font-size:12px; margin:0;">© 2026 Tadaa! Marketplace. All rights reserved.</p>
                </div>
            </div>
        </div>
    `;
    showContent();
}

// ============================================
// LOAD DATA
// ============================================
async function loadData() {
    try {
        loadCart();
        loadWishlist();
        
        const settingsDoc = await db.collection('siteSettings').doc('settings').get();
        settings = settingsDoc.data() || {};
        window.tadaaSettings = settings;
        window.tadaaDb = db;
        
        if (settings.maintenanceMode === true) {
            showMaintenancePage();
            return;
        }
        
        const categoriesSnap = await db.collection('categories').orderBy('order', 'asc').get();
        categories = [];
        categoriesSnap.forEach(doc => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        
        const productsSnap = await db.collection('products').orderBy('createdAt', 'desc').get();
        products = [];
        productsSnap.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        
        optimizeProductImages();
        
        console.log('✅ Data loaded - Categories:', categories.length, 'Products:', products.length);
        
        renderWebsite();
        updateCartCount();
        showContent();
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        if (appContainer) {
            appContainer.innerHTML = `
                <div style="text-align:center; padding:60px 20px;">
                    <h2 style="color:var(--text-primary);">😅 Oops! Something went wrong</h2>
                    <p style="color:var(--text-secondary);">Please refresh the page and try again.</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top:20px;">Refresh</button>
                </div>
            `;
        }
        showContent();
    }
}

// ============================================
// RENDER WEBSITE
// ============================================
function renderWebsite() {
    renderHeader();
    renderHero();
    renderAnnouncement();
    renderCategories();
    renderProducts();
    renderFooter();
    renderCartSidebarContent();
}

// ============================================
// RENDER HEADER
// ============================================
function renderHeader() {
    if (!mainHeader) return;
    mainHeader.innerHTML = `
        <nav style="background:#000; color:#fff; padding:16px 20px; position:sticky; top:0; z-index:100; border-bottom:1px solid rgba(255,255,255,0.05);">
            <div style="max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <span class="tadaa-title" style="font-size:24px; font-weight:700; color:#FFD400; cursor:pointer;" onclick="location.reload()">Tadaa<span style="color:#fff;">!</span></span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button onclick="toggleSearch()" style="background:rgba(255,255,255,0.08); border:none; color:#fff; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">${Icons.search}</button>
                    <button onclick="toggleTheme()" id="themeToggle" style="background:rgba(255,255,255,0.08); border:none; color:#fff; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">${Icons.moon}</button>
                    <button onclick="toggleCartSidebar()" style="background:rgba(255,255,255,0.08); border:none; color:#fff; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; position:relative; transition:all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                        ${Icons.cart}
                        <span id="cartCount" style="position:absolute; top:-2px; right:-2px; background:#FFD400; color:#000; font-size:10px; padding:2px 6px; border-radius:50%; font-weight:700; display:none; min-width:18px; text-align:center;">0</span>
                    </button>
                </div>
            </div>
            <div id="searchBar" style="display:none; margin-top:12px;">
                <input type="text" id="searchInput" placeholder="Search products..." 
                       style="width:100%; padding:14px 18px; border-radius:14px; border:2px solid #FFD400; font-size:16px; background:#1a1a1a; color:#fff; outline:none; transition:all 0.3s ease;">
            </div>
        </nav>
    `;
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            filterProducts();
        });
    }
    loadTheme();
}

// ============================================
// RENDER HERO (Upgraded with Tagline & Illustration)
// ============================================
function renderHero() {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;
    heroSection.innerHTML = `
        <div style="background:linear-gradient(135deg, #000 0%, #0d0d0d 50%, #1a1a1a 100%); padding:60px 20px 40px; text-align:center; position:relative; overflow:hidden; border-radius:0 0 40px 40px;">
            <!-- Background Effects -->
            <div style="position:absolute; top:-150px; right:-100px; width:400px; height:400px; background:radial-gradient(circle, rgba(255,212,0,0.08) 0%, transparent 70%); border-radius:50%; animation:floatSlow 6s ease-in-out infinite;"></div>
            <div style="position:absolute; bottom:-100px; left:-100px; width:300px; height:300px; background:radial-gradient(circle, rgba(255,212,0,0.05) 0%, transparent 70%); border-radius:50%; animation:float 4s ease-in-out infinite;"></div>
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:500px; height:500px; background:radial-gradient(circle, rgba(255,212,0,0.02) 0%, transparent 70%); border-radius:50%;"></div>
            
            <!-- Floating Shopping Illustration -->
            <div style="position:absolute; right:5%; bottom:10%; transform:rotate(-10deg); animation:float 5s ease-in-out infinite; opacity:0.7; pointer-events:none; z-index:0;">
                ${Icons.shoppingBag}
            </div>
            
            <div class="animate-fade-up" style="max-width:800px; margin:0 auto; position:relative; z-index:1;">
                <div style="display:inline-block; background:rgba(255,212,0,0.10); padding:6px 16px; border-radius:50px; border:1px solid rgba(255,212,0,0.15); margin-bottom:16px;">
                    <span style="color:#FFD400; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">Premium Marketplace</span>
                </div>
                <h1 class="tadaa-title" style="font-size:52px; font-weight:700; color:#FFD400; margin:0; line-height:1.1; animation:fadeInUp 0.8s ease forwards;">
                    Welcome to <span style="color:#FFD400;">Tadaa</span><span style="color:#fff;">!</span>
                </h1>
                
                <!-- New Premium Tagline -->
                <p style="font-size:18px; color:rgba(255,255,255,0.7); margin:12px 0 24px; font-family:'Inter', sans-serif; font-weight:400; animation:fadeInUp 0.8s ease 0.3s forwards; opacity:0;">
                    Everything you need, delivered to your doorstep.
                </p>
                
                <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; animation:fadeInUp 0.8s ease 0.6s forwards; opacity:0;">
                    <button onclick="scrollToProducts()" class="btn btn-primary" style="background:linear-gradient(135deg, #FFD400 0%, #E6BF00 100%); color:#000; border:none; padding:14px 36px; border-radius:50px; font-size:16px; font-weight:700; cursor:pointer; box-shadow:0 4px 24px rgba(255,212,0,0.3); transition:all 0.3s ease; display:flex; align-items:center; gap:8px;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 40px rgba(255,212,0,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 24px rgba(255,212,0,0.3)'">
                        ${Icons.shop} Shop Now ${Icons.arrowRight}
                    </button>
                    <button onclick="scrollToCategories()" class="btn btn-outline" style="background:transparent; color:#FFD400; border:2px solid #FFD400; padding:14px 32px; border-radius:50px; font-size:16px; font-weight:600; cursor:pointer; transition:all 0.3s ease; display:flex; align-items:center; gap:8px;" onmouseover="this.style.background='rgba(255,212,0,0.10)'; this.style.transform='translateY(-3px)'" onmouseout="this.style.background='transparent'; this.style.transform='translateY(0)'">
                        ${Icons.category} Browse Categories
                    </button>
                </div>
            </div>
        </div>
        
        <!-- PREMIUM TRUST BADGES -->
        <div style="max-width:1200px; margin:-20px auto 0; padding:0 20px; position:relative; z-index:2;">
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; background:var(--bg-card); border-radius:20px; padding:20px; box-shadow:var(--shadow-lg); border:1px solid var(--border-color); animation:fadeInUp 0.8s ease 0.8s forwards; opacity:0;">
                <div class="flex flex-col items-center text-center" style="gap:4px;">
                    <div style="background:rgba(255,212,0,0.1); width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#FFD400;">${Icons.quality}</div>
                    <span style="font-weight:600; font-size:13px; color:var(--text-primary);">Quality Products</span>
                </div>
                <div class="flex flex-col items-center text-center" style="gap:4px;">
                    <div style="background:rgba(255,212,0,0.1); width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#FFD400;">${Icons.fast}</div>
                    <span style="font-weight:600; font-size:13px; color:var(--text-primary);">Fast & Safe Delivery</span>
                </div>
                <div class="flex flex-col items-center text-center" style="gap:4px;">
                    <div style="background:rgba(255,212,0,0.1); width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#FFD400;">${Icons.priceTag}</div>
                    <span style="font-weight:600; font-size:13px; color:var(--text-primary);">Best Price Guaranteed</span>
                </div>
                <div class="flex flex-col items-center text-center" style="gap:4px;">
                    <div style="background:rgba(255,212,0,0.1); width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#FFD400;">${Icons.shield}</div>
                    <span style="font-weight:600; font-size:13px; color:var(--text-primary);">Secure Checkout</span>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// RENDER ANNOUNCEMENT
// ============================================
function renderAnnouncement() {
    const announcementDiv = document.getElementById('announcement-section');
    if (!announcementDiv) return;
    if (settings.announcementBanner) {
        announcementDiv.innerHTML = `
            <div style="background:linear-gradient(135deg, #FFD400 0%, #E6BF00 100%); padding:12px 20px; text-align:center; color:#000; font-weight:600; border-radius:12px; margin:16px 20px; box-shadow:0 4px 20px rgba(255,212,0,0.2);">
                📢 ${settings.announcementBanner}
            </div>
        `;
    } else {
        announcementDiv.innerHTML = '';
    }
}

// ============================================
// RENDER CATEGORIES
// ============================================
function renderCategories() {
    const categoriesDiv = document.getElementById('categories-section');
    if (!categoriesDiv) return;
    if (categories.length === 0) {
        categoriesDiv.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-secondary);"><p>No categories yet.</p></div>`;
        return;
    }
    let html = `
        <div style="max-width:1200px; margin:0 auto; padding:0 20px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:8px;">
                <h2 class="section-title" style="font-size:26px; color:var(--text-primary); margin:0; display:flex; align-items:center; gap:10px;">
                    ${Icons.category} Categories
                </h2>
            </div>
            <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:12px; scrollbar-width:none; -ms-overflow-style:none;">
                <button onclick="filterByCategory('all')" class="category-btn ${currentCategory === 'all' ? 'active' : ''}" style="padding:10px 22px; border-radius:50px; border:2px solid ${currentCategory === 'all' ? '#FFD400' : 'var(--border-color)'}; background:${currentCategory === 'all' ? '#FFD400' : 'transparent'}; color:${currentCategory === 'all' ? '#000' : 'var(--text-secondary)'}; cursor:pointer; white-space:nowrap; font-weight:600; transition:all 0.3s ease; flex-shrink:0; font-family:'Inter', sans-serif; font-size:13px;">
                    All
                </button>
    `;
    categories.forEach(cat => {
        const isActive = currentCategory === cat.id;
        html += `
            <button onclick="filterByCategory('${cat.id}')" class="category-btn ${isActive ? 'active' : ''}" style="padding:10px 22px; border-radius:50px; border:2px solid ${isActive ? '#FFD400' : 'var(--border-color)'}; background:${isActive ? '#FFD400' : 'transparent'}; color:${isActive ? '#000' : 'var(--text-secondary)'}; cursor:pointer; white-space:nowrap; font-weight:${isActive ? '700' : '500'}; transition:all 0.3s ease; flex-shrink:0; font-family:'Inter', sans-serif; font-size:13px;">
                ${cat.icon || ''} ${cat.name}
            </button>
        `;
    });
    html += `</div></div>`;
    categoriesDiv.innerHTML = html;
}

// ============================================
// RENDER PRODUCTS (Fixed Images & Wishlist Support)
// ============================================
function renderProducts() {
    const productsDiv = document.getElementById('products-section');
    if (!productsDiv) return;
    
    let filteredProducts = products;
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.categoryId === currentCategory);
    }
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            (p.description && p.description.toLowerCase().includes(searchTerm))
        );
    }
    
    if (filteredProducts.length === 0) {
        productsDiv.innerHTML = `
            <div style="max-width:1200px; margin:0 auto; padding:60px 20px; text-align:center; color:var(--text-secondary);">
                <div style="font-size:56px; margin-bottom:16px;">${Icons.emptyCart}</div>
                <p style="font-size:20px; font-weight:600; color:var(--text-primary);">No products found</p>
                <p style="color:var(--text-muted); margin-top:4px;">Try adjusting your search or filter</p>
                <button onclick="filterByCategory('all'); searchTerm=''; document.getElementById('searchInput').value=''; filterProducts();" class="btn btn-primary" style="margin-top:16px; background:linear-gradient(135deg, #FFD400 0%, #E6BF00 100%); color:#000; border:none; padding:12px 28px; border-radius:50px; font-weight:600; cursor:pointer;">Show All Products</button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="max-width:1200px; margin:0 auto; padding:0 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:8px;">
                <h2 class="section-title" style="font-size:24px; color:var(--text-primary); margin:0; display:flex; align-items:center; gap:10px;">
                    ${Icons.shop} Products
                </h2>
                <span style="color:var(--text-secondary); font-size:13px; font-weight:500;">${filteredProducts.length} products</span>
            </div>
            <div class="stagger-children" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px;">
    `;
    
    filteredProducts.forEach((product, index) => {
        let imageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
        if (imageUrl && imageUrl.includes('cloudinary.com')) {
            imageUrl = optimizeCloudinaryImage(imageUrl);
        }
        
        const inStock = product.inStock !== false && (product.stockCount || 0) > 0;
        const discount = product.discount || 0;
        const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
        const cartItem = cart.find(item => item.id === product.id);
        const qty = cartItem ? cartItem.quantity : 0;
        const productDeliveryFee = product.deliveryFee || settings.deliveryFee || 100;
        const deliveryDisplay = productDeliveryFee > 0 ? `Delivery: ₦${productDeliveryFee}/item` : 'Free Delivery';
        const isInWishlist = wishlist.includes(product.id);
        
        html += `
            <div class="product-card" data-product-id="${product.id}" onclick="viewProduct('${product.id}')" style="background:var(--bg-card); border-radius:16px; overflow:hidden; box-shadow:var(--shadow-sm); border:1px solid var(--border-color); cursor:pointer; transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);">
                <div class="image-wrapper" style="position:relative; padding-bottom:100%; background:var(--bg-input); overflow:hidden;">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${product.name}" loading="lazy" decoding="async" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; transition:transform 0.6s cubic-bezier(0.34,1.56,0.64,1);">` : `<div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:32px; color:var(--text-muted);">${Icons.box}</div>`}
                    ${discount > 0 ? `<div style="position:absolute; top:12px; right:12px; background:#EF4444; color:#fff; padding:3px 10px; border-radius:50px; font-size:10px; font-weight:700;">-${discount}%</div>` : ''}
                    ${!inStock ? `<div style="position:absolute; bottom:8px; left:8px; right:8px; background:rgba(0,0,0,0.75); backdrop-filter:blur(8px); color:#fff; text-align:center; padding:4px; border-radius:8px; font-size:11px; font-weight:600;">Out of Stock</div>` : ''}
                    <div class="in-cart-badge" style="position:absolute; top:12px; left:12px; background:#10B981; color:#fff; padding:2px 10px; border-radius:50px; font-size:9px; font-weight:700; ${qty > 0 ? 'display:block;' : 'display:none;'}">${qty} in Cart</div>
                    
                    <!-- Wishlist Heart Button -->
                    <button onclick="event.stopPropagation(); toggleWishlist('${product.id}')" style="position:absolute; bottom:12px; right:12px; background:rgba(255,255,255,0.9); border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 12px rgba(0,0,0,0.1); transition:all 0.2s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        ${isInWishlist ? Icons.heartFilled : Icons.heart}
                    </button>
                </div>
                
                <div style="padding:16px;">
                    <h3 style="font-size:15px; font-weight:600; margin:0 0 4px; color:var(--text-primary); line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${product.name}</h3>
                    <p style="font-size:12px; color:var(--text-muted); margin:0 0 6px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.4;">${product.description || ''}</p>
                    
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <span style="font-size:18px; font-weight:700; color:var(--text-primary);">₦${Math.round(discountedPrice).toLocaleString()}</span>
                        ${discount > 0 ? `<span style="font-size:12px; color:var(--text-muted); text-decoration:line-through;">₦${product.price.toLocaleString()}</span>` : ''}
                    </div>
                    
                    <div style="font-size:11px; color:var(--text-secondary); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                        ${Icons.truck} ${deliveryDisplay}
                    </div>
                    
                    ${inStock ? `
                    <div style="display:flex; align-items:center; gap:6px;">
                        <button class="qty-minus" onclick="event.stopPropagation(); updateProductQuantity('${product.id}', -1)" style="background:var(--bg-input); border:1px solid var(--border-color); width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:14px; font-weight:700; color:var(--text-primary); transition:all 0.2s; display:flex; align-items:center; justify-content:center; ${qty === 0 ? 'opacity:0.4; cursor:not-allowed;' : ''}" ${qty === 0 ? 'disabled' : ''}>${Icons.minus}</button>
                        <span class="qty-display" style="min-width:28px; text-align:center; font-size:15px; font-weight:600; color:var(--text-primary);">${qty}</span>
                        <button class="qty-plus" onclick="event.stopPropagation(); updateProductQuantity('${product.id}', 1)" style="background:var(--bg-input); border:1px solid var(--border-color); width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:14px; font-weight:700; color:var(--text-primary); transition:all 0.2s; display:flex; align-items:center; justify-content:center;">${Icons.plus}</button>
                        <button class="qty-add-btn" onclick="event.stopPropagation(); addToCart('${product.id}')" style="flex:1; background:linear-gradient(135deg, #FFD400 0%, #E6BF00 100%); color:#000; border:none; padding:6px 12px; border-radius:8px; font-weight:600; font-size:12px; cursor:pointer; transition:all 0.2s; min-width:60px;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            ${qty > 0 ? 'Update' : 'Add +'}
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    productsDiv.innerHTML = html;
}

// ============================================
// WISHLIST FUNCTIONS
// ============================================
function loadWishlist() {
    try {
        const saved = localStorage.getItem('tadaa_wishlist');
        if (saved) {
            wishlist = JSON.parse(saved);
            console.log('❤️ Wishlist loaded:', wishlist.length, 'items');
        }
    } catch (e) {
        console.error('Error loading wishlist:', e);
        wishlist = [];
    }
}

function saveWishlist() {
    try {
        localStorage.setItem('tadaa_wishlist', JSON.stringify(wishlist));
    } catch (e) {
        console.error('Error saving wishlist:', e);
    }
}

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToastMessage('Removed from Wishlist');
    } else {
        wishlist.push(productId);
        showToastMessage('Added to Wishlist ❤️');
    }
    saveWishlist();
    renderProducts(); // Re-render to update the heart icon instantly
    renderWishlistPage(); // Update the wishlist tab view
}

function renderWishlistPage() {
    const wishlistSection = document.getElementById('wishlist-section');
    if (!wishlistSection) return;
    
    if (wishlist.length === 0) {
        wishlistSection.innerHTML = `
            <div style="max-width:400px; margin:0 auto; padding:40px 20px; text-align:center;">
                <div style="font-size:48px; color:var(--text-muted); margin-bottom:16px;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <h3 class="tadaa-title" style="font-size:22px; color:var(--text-primary); margin-bottom:8px;">Your Wishlist</h3>
                <p style="color:var(--text-muted);">Save your favorite items here for later.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="max-width:800px; margin:0 auto; padding:20px;">
            <h3 class="tadaa-title" style="font-size:22px; color:var(--text-primary); margin-bottom:16px;">Your Wishlist (${wishlist.length})</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:16px;">
    `;
    
    wishlist.forEach(id => {
        const product = products.find(p => p.id === id);
        if (!product) return;
        let imageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
        if (imageUrl && imageUrl.includes('cloudinary.com')) {
            imageUrl = optimizeCloudinaryImage(imageUrl);
        }
        
        html += `
            <div class="product-card" onclick="viewProduct('${product.id}')" style="background:var(--bg-card); border-radius:16px; overflow:hidden; box-shadow:var(--shadow-sm); border:1px solid var(--border-color); cursor:pointer;">
                <div class="image-wrapper" style="position:relative; padding-bottom:100%; background:var(--bg-input);">
                    ${imageUrl ? `<img src="${imageUrl}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">` : `<div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:32px; color:var(--text-muted);">${Icons.box}</div>`}
                    <button onclick="event.stopPropagation(); toggleWishlist('${product.id}')" style="position:absolute; top:12px; right:12px; background:#fff; border:none; width:32px; height:32px; border-radius:50%; cursor:pointer; box-shadow:0 2px 12px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${Icons.heartFilled}</button>
                </div>
                <div style="padding:12px;">
                    <h3 style="font-size:14px; font-weight:600; margin:0; color:var(--text-primary); line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${product.name}</h3>
                    <p style="font-size:16px; font-weight:700; color:var(--text-primary); margin-top:4px;">₦${product.price.toLocaleString()}</p>
                </div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    wishlistSection.innerHTML = html;
}

// ============================================
// UPDATE PRODUCT QUANTITY DISPLAYS
// ============================================
function updateProductQuantityDisplays() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.getAttribute('data-product-id');
        if (!productId) return;
        
        const cartItem = cart.find(item => item.id === productId);
        const qty = cartItem ? cartItem.quantity : 0;
        
        const qtyDisplay = card.querySelector('.qty-display');
        if (qtyDisplay) {
            qtyDisplay.textContent = qty;
        }
        
        const minusBtn = card.querySelector('.qty-minus');
        if (minusBtn) {
            if (qty === 0) {
                minusBtn.style.opacity = '0.4';
                minusBtn.style.cursor = 'not-allowed';
                minusBtn.disabled = true;
            } else {
                minusBtn.style.opacity = '1';
                minusBtn.style.cursor = 'pointer';
                minusBtn.disabled = false;
            }
        }
        
        const addBtn = card.querySelector('.qty-add-btn');
        if (addBtn) {
            addBtn.textContent = qty > 0 ? 'Update' : 'Add +';
        }
        
        const inCartBadge = card.querySelector('.in-cart-badge');
        if (inCartBadge) {
            if (qty > 0) {
                inCartBadge.textContent = `${qty} in Cart`;
                inCartBadge.style.display = 'block';
            } else {
                inCartBadge.style.display = 'none';
            }
        }
    });
}

// ============================================
// UPDATE PRODUCT QUANTITY
// ============================================
function updateProductQuantity(productId, change) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (!existing) {
        if (change > 0) {
            addToCart(productId);
        }
        return;
    }
    
    const newQty = existing.quantity + change;
    if (newQty <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const maxStock = product.stockCount || 999;
    if (newQty > maxStock) {
        alert(`Only ${maxStock} items available.`);
        return;
    }
    
    existing.quantity = newQty;
    saveCart();
    updateCartCount();
    renderCartSidebarContent();
    updateProductQuantityDisplays();
}

// ============================================
// FILTER PRODUCTS
// ============================================
function filterProducts() { renderProducts(); }

function filterByCategory(categoryId) {
    currentCategory = categoryId;
    filterProducts();
    renderCategories();
}

function scrollToProducts() { document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }
function scrollToCategories() { document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }); }

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.style.display = searchBar.style.display === 'none' ? 'block' : 'none';
        if (searchBar.style.display === 'block') {
            document.getElementById('searchInput')?.focus();
        }
    }
}

// ============================================
// VIEW PRODUCT
// ============================================
function viewProduct(productId) {
    closeModal();
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let imageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
    if (imageUrl && imageUrl.includes('cloudinary.com')) {
        imageUrl = optimizeCloudinaryImageLarge(imageUrl);
    }
    const discount = product.discount || 0;
    const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
    const inStock = product.inStock !== false && (product.stockCount || 0) > 0;
    const maxStock = product.stockCount || 999;
    const productDeliveryFee = product.deliveryFee || settings.deliveryFee || 100;
    
    const modal = document.createElement('div');
    modal.id = 'productModal';
    modal.style.cssText = `position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn 0.3s ease;`;
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal();
        }
    };
    
    modal.innerHTML = `
        <div style="background:var(--bg-card); border-radius:24px; max-width:500px; width:100%; max-height:90vh; overflow-y:auto; padding:28px; position:relative; animation:fadeInScale 0.4s cubic-bezier(0.34,1.56,0.64,1); box-shadow:var(--shadow-xl);">
            <button onclick="closeModal()" style="position:absolute; top:16px; right:20px; background:var(--bg-input); border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; color:var(--text-secondary); display:flex; align-items:center; justify-content:center; transition:all 0.3s ease;" onmouseover="this.style.background='var(--border-color)'" onmouseout="this.style.background='var(--bg-input)'">${Icons.close}</button>
            <div style="border-radius:16px; overflow:hidden; background:var(--bg-input); margin-bottom:16px;">
                ${imageUrl ? `<img src="${imageUrl}" alt="${product.name}" style="width:100%; height:auto; max-height:300px; object-fit:cover;">` : `<div style="padding:60px; text-align:center; font-size:48px; color:var(--text-muted);">${Icons.box}</div>`}
            </div>
            <h2 class="tadaa-title" style="font-size:24px; margin:0 0 4px; color:var(--text-primary);">${product.name}</h2>
            <p style="color:var(--text-secondary); margin:0 0 4px; font-size:14px;">${product.categoryName || 'Uncategorized'}</p>
            <p style="color:var(--text-muted); margin:0 0 12px; font-size:14px; line-height:1.5;">${product.description || 'No description available.'}</p>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px; flex-wrap:wrap;">
                <span style="font-size:28px; font-weight:700; color:var(--text-primary);">₦${Math.round(discountedPrice).toLocaleString()}</span>
                ${discount > 0 ? `<span style="font-size:16px; color:var(--text-muted); text-decoration:line-through;">₦${product.price.toLocaleString()}</span>` : ''}
                ${discount > 0 ? `<span style="background:#EF4444; color:#fff; padding:2px 12px; border-radius:50px; font-size:12px; font-weight:700;">${discount}% OFF</span>` : ''}
            </div>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px; flex-wrap:wrap;">
                <span style="color:var(--text-secondary); font-size:14px;">${inStock ? `${Icons.check} ${product.stockCount || 0} available` : 'Out of Stock'}</span>
            </div>
            <div style="font-size:13px; color:var(--text-secondary); margin-bottom:12px; display:flex; align-items:center; gap:6px;">
                ${Icons.truck} Delivery: ₦${productDeliveryFee}/item
            </div>
            ${inStock ? `
            <div style="margin:16px 0;">
                <div style="font-size:14px; font-weight:600; margin-bottom:8px; color:var(--text-primary);">Quantity</div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <button onclick="changeModalQty('${product.id}', -1)" style="background:var(--bg-input); border:2px solid var(--border-color); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:20px; font-weight:700; color:var(--text-primary); transition:all 0.2s; display:flex; align-items:center; justify-content:center;" onmouseover="this.style.background='var(--border-color)'" onmouseout="this.style.background='var(--bg-input)'">${Icons.minus}</button>
                    <span id="modal-qty-display-${product.id}" style="min-width:40px; text-align:center; font-size:22px; font-weight:700; color:var(--text-primary);">1</span>
                    <button onclick="changeModalQty('${product.id}', 1)" style="background:var(--bg-input); border:2px solid var(--border-color); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:20px; font-weight:700; color:var(--text-primary); transition:all 0.2s; display:flex; align-items:center; justify-content:center;" onmouseover="this.style.background='var(--border-color)'" onmouseout="this.style.background='var(--bg-input)'">${Icons.plus}</button>
                </div>
            </div>
            <button onclick="addModalToCart('${product.id}')" class="btn btn-primary" style="width:100%; background:linear-gradient(135deg, #FFD400 0%, #E6BF00 100%); color:#000; border:none; padding:14px; border-radius:14px; font-size:18px; font-weight:700; cursor:pointer; transition:all 0.3s ease; box-shadow:0 4px 24px rgba(255,212,0,0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 40px rgba(255,212,0,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 24px rgba(255,212,0,0.3)'">${Icons.cart} Add to Cart</button>
            ` : `<button style="width:100%; background:#9CA3AF; color:#fff; border:none; padding:14px; border-radius:14px; font-size:18px; font-weight:600; cursor:not-allowed;">Out of Stock</button>`}
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ============================================
// MODAL QUANTITY CONTROLS
// ============================================
function changeModalQty(productId, change) {
    const display = document.getElementById(`modal-qty-display-${productId}`);
    if (!display) return;
    let val = parseInt(display.textContent) || 1;
    val = val + change;
    const product = products.find(p => p.id === productId);
    const maxStock = product?.stockCount || 999;
    if (val < 1) val = 1;
    if (val > maxStock) val = maxStock;
    display.textContent = val;
}

// ============================================
// ADD TO CART FROM MODAL
// ============================================
function addModalToCart(productId) {
    const display = document.getElementById(`modal-qty-display-${productId}`);
    const qty = parseInt(display?.textContent) || 1;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const maxStock = product.stockCount || 999;
    if (qty > maxStock) {
        alert(`Only ${maxStock} items available.`);
        return;
    }
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity = qty;
    } else {
        cart.push({ ...product, quantity: qty });
    }
    
    saveCart();
    updateCartCount();
    closeModal();
    renderCartSidebarContent();
    updateProductQuantityDisplays();
    showToast(product.name);
}

// ============================================
// CLOSE MODAL
// ============================================
function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
    }
    document.querySelectorAll('.modal-overlay, .modal-backdrop').forEach(el => el.remove());
    document.body.style.overflow = '';
    document.body.style.position = '';
    const app = document.getElementById('app');
    if (app) {
        app.style.filter = '';
        app.style.pointerEvents = '';
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(productName) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position:fixed; bottom:20px; right:20px; background:var(--toast-bg); color:var(--toast-text); padding:16px 20px; border-radius:16px; box-shadow:0 8px 40px var(--shadow-xl); z-index:2000; max-width:380px; width:100%; border-left:4px solid #FFD400; animation:slideInRight 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
    `;
    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
            <div style="background:#FFD400; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#000;">${Icons.check}</div>
            <div style="flex:1;">
                <p style="margin:0; font-weight:700; color:var(--text-primary);">Added to Cart!</p>
                <p style="margin:0; font-size:14px; color:var(--text-secondary);">${productName}</p>
            </div>
            <button onclick="this.closest('.toast-notification').remove()" style="background:var(--bg-input); border:none; width:32px; height:32px; border-radius:50%; cursor:pointer; color:var(--text-muted); display:flex; align-items:center; justify-content:center; transition:all 0.3s ease;" onmouseover="this.style.background='var(--border-color)'" onmouseout="this.style.background='var(--bg-input)'">${Icons.close}</button>
        </div>
        <div style="display:flex; gap:8px; margin-top:12px;">
            <button onclick="this.closest('.toast-notification').remove(); toggleCartSidebar();" class="btn btn-primary" style="flex:1; background:linear-gradient(135deg, #FFD400 0%, #E6BF00 100%); color:#000; border:none; padding:8px; border-radius:8px; font-weight:600; cursor:pointer; font-size:13px;">View Cart</button>
            <button onclick="this.closest('.toast-notification').remove();" style="flex:1; background:var(--bg-input); color:var(--text-primary); border:1px solid var(--border-color); padding:8px; border-radius:8px; font-weight:600; cursor:pointer; font-size:13px;">Continue</button>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 5000);
}

// Helper for Wishlist Toast
function showToastMessage(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position:fixed; bottom:20px; right:20px; background:var(--toast-bg); color:var(--toast-text); padding:12px 20px; border-radius:16px; box-shadow:0 8px 40px var(--shadow-xl); z-index:2000; max-width:280px; width:100%; border-left:4px solid #FFD400; animation:slideInRight 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
    `;
    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:14px; font-weight:500; color:var(--text-primary);">${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 2500);
}

// ============================================
// CART FUNCTIONS
// ============================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    renderCartSidebarContent();
    updateProductQuantityDisplays();
    showToast(product.name);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartSidebarContent();
    updateProductQuantityDisplays();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    const newQty = item.quantity + change;
    if (newQty <= 0) {
        removeFromCart(productId);
        return;
    }
    item.quantity = newQty;
    saveCart();
    updateCartCount();
    renderCartSidebarContent();
    updateProductQuantityDisplays();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Clear your entire cart?')) {
        cart = [];
        saveCart();
        updateCartCount();
        renderCartSidebarContent();
        updateProductQuantityDisplays();
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'inline' : 'none';
    }
}

// ============================================
// RENDER CART SIDEBAR CONTENT
// ============================================
function renderCartSidebarContent() {
    let sidebar = document.getElementById('cartSidebar');
    if (!sidebar) {
        sidebar = document.createElement('div');
        sidebar.id = 'cartSidebar';
        sidebar.style.cssText = `position:fixed; top:0; right:-400px; width:380px; height:100%; height:100vh; height:100dvh; min-height:-webkit-fill-available; background:var(--bg-card); z-index:1500; transition:right 0.5s cubic-bezier(0.34,1.56,0.64,1); box-shadow:-8px 0 40px var(--shadow-lg); display:flex; flex-direction:column;`;
        document.body.appendChild(sidebar);
        
        const overlay = document.createElement('div');
        overlay.id = 'cartOverlay';
        overlay.style.cssText = `position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:1400; display:none; cursor:pointer;`;
        overlay.onclick = function() {
            closeCartSidebar();
        };
        document.body.appendChild(overlay);
    }
    
    if (cart.length === 0) {
        sidebar.innerHTML = `
            <div style="padding:20px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
                <h3 class="tadaa-title" style="margin:0; color:var(--text-primary); font-size:22px;">${Icons.cart} Your Cart</h3>
                <button onclick="closeCartSidebar()" style="background:var(--bg-input); border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; color:var(--text-secondary); display:flex; align-items:center; justify-content:center; transition:all 0.3s ease;" onmouseover="this.style.background='var(--border-color)'" onmouseout="this.style.background='var(--bg-input)'">${Icons.close}</button>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px; color:var(--text-secondary); text-align:center;">
                <div style="font-size:64px; color:var(--text-muted); margin-bottom:16px;">${Icons.emptyCart}</div>
                <p style="font-size:18px; font-weight:600; color:var(--text-primary); margin:0;">Your cart is empty</p>
                <p style="color:var(--text-muted); margin-top:4px;">Start shopping to add items</p>
                <button onclick="closeCartSidebar()" class="btn btn-primary" style="background:linear-gradient(135deg, #FFD400 0%, #E6BF00 100%); color:#000; border:none; padding:12px 24px; border-radius:50px; margin-top:16px; cursor:pointer; font-weight:600;">Continue Shopping</button>
            </div>
        `;
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const minOrderValue = 30000;
    const movMet = subtotal >= minOrderValue;
    
    let totalDelivery = 0;
    cart.forEach(item => {
        const productDeliveryFee = item.deliveryFee || settings.deliveryFee || 100;
        totalDelivery += productDeliveryFee * item.quantity;
    });
    
    const deliveryCap = 10000;
    const cappedDelivery = Math.min(totalDelivery, deliveryCap);
    const freeThreshold = settings.freeDeliveryThreshold || 5000;
    const freeDeliveryEnabled = settings.freeDeliveryEnabled === true;
    const isFreeDelivery = freeDeliveryEnabled && freeThreshold > 0 && subtotal >= freeThreshold;
    const deliveryCharge = isFreeDelivery ? 0 : cappedDelivery;
    const total = subtotal + deliveryCharge;
    const remainingForFree = freeThreshold - subtotal;
    const remainingForMOV = minOrderValue - subtotal;
    
    let deliveryDisplayText = '';
    if (isFreeDelivery) {
        deliveryDisplayText = '🎉 FREE';
    } else {
        deliveryDisplayText = `₦${deliveryCharge.toLocaleString()}`;
    }
    
    let cartHtml = `
        <div style="padding:20px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
            <h3 class="tadaa-title" style="margin:0; color:var(--text-primary); font-size:22px;">${Icons.cart} Your Cart</h3>
            <div style="display:flex; align-items:center; gap:8px;">
                <button onclick="clearCart()" style="background:var(--bg-input); border:none; padding:6px 12px; border-radius:8px; color:#EF4444; font-size:12px; cursor:pointer; font-weight:600; transition:all 0.3s ease;" onmouseover="this.style.background='rgba(239,68,68,0.1)'" onmouseout="this.style.background='var(--bg-input)'">Clear</button>
                <button onclick="closeCartSidebar()" style="background:var(--bg-input); border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; color:var(--text-secondary); display:flex; align-items:center; justify-content:center; transition:all 0.3s ease;" onmouseover="this.style.background='var(--border-color)'" onmouseout="this.style.background='var(--bg-input)'">${Icons.close}</button>
            </div>
        </div>
        <div style="flex:1; overflow-y:auto; padding:16px 20px;">
    `;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        let imageUrl = item.images && item.images.length > 0 ? item.images[0] : '';
        if (imageUrl && imageUrl.includes('cloudinary.com')) {
            imageUrl = optimizeCloudinaryImageCart(imageUrl);
        }
        const itemDeliveryFee = item.deliveryFee || settings.deliveryFee || 100;
        cartHtml += `
            <div class="order-item" style="display:flex; gap:12px; padding:12px 0; border-bottom:1px solid var(--border-color); align-items:center;">
                <div style="width:56px; height:56px; border-radius:8px; overflow:hidden; background:var(--bg-input); flex-shrink:0;">
                    ${imageUrl ? `<img src="${imageUrl}" style="width:100%; height:100%; object-fit:cover;" loading="lazy" decoding="async">` : Icons.box}
                </div>
                <div class="info" style="flex:1; min-width:0;">
                    <p class="item-name" style="margin:0; font-weight:600; font-size:14px; color:var(--text-primary);">${item.name}</p>
                    <p style="margin:2px 0 0; font-size:14px; font-weight:700; color:var(--text-primary);">₦${item.price.toLocaleString()}</p>
                    <p style="margin:2px 0 0; font-size:11px; color:var(--text-secondary); display:flex; align-items:center; gap:4px;">${Icons.truck} ₦${itemDeliveryFee}/item</p>
                    <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
                        <button onclick="updateQuantity('${item.id}', -1)" style="background:var(--bg-input); border:1px solid var(--border-color); width:28px; height:28px; border-radius:50%; cursor:pointer; font-size:16px; color:var(--text-primary); display:flex; align-items:center; justify-content:center; transition:all 0.2s;" onmouseover="this.style.background='var(--border-color)'" onmouseout="this.style.background='var(--bg-input)'">${Icons.minus}</button>
                        <span style="font-weight:600; min-width:24px; text-align:center; color:var(--text-primary);">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" style="background:var(--bg-input); border:1px solid var(--border-color); width:28px; height:28px; border-radius:50%; cursor:pointer; font-size:16px; color:var(--text-primary); display:flex; align-items:center; justify-content:center; transition:all 0.2s;" onmouseover="this.style.background='var(--border-color)'" onmouseout="this.style.background='var(--bg-input)'">${Icons.plus}</button>
                        <span style="margin-left:auto; font-weight:700; color:var(--text-primary); font-size:14px;">₦${itemTotal.toLocaleString()}</span>
                        <button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:#EF4444; cursor:pointer; font-size:16px; padding:4px; transition:all 0.2s; display:flex; align-items:center; justify-content:center;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">${Icons.trash}</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartHtml += `
        </div>
        <div style="padding:16px 20px; padding-bottom:calc(16px + env(safe-area-inset-bottom, 0px)); border-top:2px solid var(--border-color); flex-shrink:0; background:var(--bg-input); border-radius:0 0 16px 16px;">
            <div style="padding:8px 0; margin-bottom:8px; border-bottom:1px solid var(--border-color);">
                <div style="display:flex; justify-content:space-between; font-size:14px;">
                    <span style="color:var(--text-secondary);">Minimum Order:</span>
                    <span style="font-weight:600; color:${movMet ? '#10B981' : '#EF4444'};">₦${minOrderValue.toLocaleString()}</span>
                </div>
                ${!movMet ? `<div style="background:#FEF3C7; color:#92400E; padding:6px 12px; border-radius:8px; margin-top:4px; font-size:12px; text-align:center; font-weight:500;">Add ₦${remainingForMOV.toLocaleString()} more to meet minimum order</div>` : ''}
            </div>
            
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span style="color:var(--text-secondary);">Subtotal</span>
                <span style="font-weight:600; color:var(--text-primary);">₦${subtotal.toLocaleString()}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span style="color:var(--text-secondary);">Delivery</span>
                <span style="font-weight:600; color:var(--text-primary);">${deliveryDisplayText}</span>
            </div>
            ${isFreeDelivery ? `<div style="background:#D1FAE5; color:#065F46; padding:8px 12px; border-radius:8px; margin-bottom:8px; text-align:center; font-size:14px; font-weight:600;">🎉 You qualify for FREE delivery!</div>` : ''}
            ${!isFreeDelivery && freeDeliveryEnabled && remainingForFree > 0 ? `<div style="background:#FEF3C7; color:#92400E; padding:8px 12px; border-radius:8px; margin-bottom:8px; text-align:center; font-size:13px; font-weight:500;">Add ₦${remainingForFree.toLocaleString()} more for FREE delivery</div>` : ''}
            
            <div style="display:flex; justify-content:space-between; font-size:20px; font-weight:700; border-top:2px solid var(--border-color); padding-top:12px; margin-top:6px;">
                <span style="color:var(--text-secondary);">Total</span>
                <span style="color:#FFD400; font-size:24px;">₦${total.toLocaleString()}</span>
            </div>
            
            <button 
                onclick="event.stopPropagation(); closeCartSidebar(); checkout();" 
                style="width:100%; background:linear-gradient(135deg, #FFD400 0%, #E6BF00 100%); color:#000; border:none; padding:14px; border-radius:14px; font-size:18px; font-weight:700; cursor:pointer; margin-top:12px; transition:all 0.3s ease; box-shadow:0 4px 24px rgba(255,212,0,0.3); ${!movMet ? 'opacity:0.5; cursor:not-allowed;' : ''}" 
                onmouseover="if(!this.disabled){this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 40px rgba(255,212,0,0.4)'}" 
                onmouseout="if(!this.disabled){this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 24px rgba(255,212,0,0.3)'}" 
                ${!movMet ? 'disabled' : ''}>
                ${!movMet ? `🛒 Add ₦${remainingForMOV.toLocaleString()} more` : 'Proceed to Checkout →'}
            </button>
        </div>
    `;
    sidebar.innerHTML = cartHtml;
}

// ============================================
// TOGGLE CART SIDEBAR
// ============================================
function toggleCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (!sidebar) return;
    
    if (sidebar.style.right === '0px') {
        closeCartSidebar();
    } else {
        renderCartSidebarContent();
        sidebar.style.right = '0px';
        if (overlay) overlay.style.display = 'block';
        document.body.classList.add('cart-open');
    }
}

function closeCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) {
        sidebar.style.right = '-400px';
    }
    if (overlay) {
        overlay.style.display = 'none';
    }
    document.body.classList.remove('cart-open');
}

// ============================================
// CHECKOUT
// ============================================
function checkout() {
    if (cart.length === 0) {
        alert('🛒 Your cart is empty!');
        return;
    }
    closeCartSidebar();
    window.location.href = './checkout.html';
}

// ============================================
// RENDER FOOTER (PREMIUM UPGRADE WITH EMAIL & ADDRESS)
// ============================================
function renderFooter() {
    if (!mainFooter) return;
    mainFooter.innerHTML = `
        <footer style="background:#000; color:#9CA3AF; padding:48px 20px 24px; margin-top:40px; border-radius:32px 32px 0 0; border-top:1px solid rgba(255,255,255,0.06);">
            <div style="max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:32px;">
                <!-- Brand Column -->
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <h3 class="tadaa-title" style="color:#FFD400; font-size:24px; margin:0;">Tadaa!</h3>
                    <p style="margin:0; font-size:14px; opacity:0.6; line-height:1.5;">Your premium online marketplace. Quality products, fast delivery.</p>
                </div>
                
                <!-- Quick Links -->
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <h4 style="color:#fff; margin:0 0 4px; font-size:15px; font-weight:600;">Quick Links</h4>
                    <a href="#" onclick="switchTab('home')" style="color:rgba(255,255,255,0.5); font-size:13px; transition:color 0.2s; text-decoration:none;" onmouseover="this.style.color='#FFD400'" onmouseout="this.style.color='rgba(255,255,255,0.5)'">Shop</a>
                    <a href="#" onclick="switchTab('track')" style="color:rgba(255,255,255,0.5); font-size:13px; transition:color 0.2s; text-decoration:none;" onmouseover="this.style.color='#FFD400'" onmouseout="this.style.color='rgba(255,255,255,0.5)'">Track Order</a>
                    <a href="#" onclick="switchTab('wishlist')" style="color:rgba(255,255,255,0.5); font-size:13px; transition:color 0.2s; text-decoration:none;" onmouseover="this.style.color='#FFD400'" onmouseout="this.style.color='rgba(255,255,255,0.5)'">Wishlist</a>
                </div>
                
                <!-- Contact Column (With Email, Address & Hours) -->
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <h4 style="color:#fff; margin:0 0 4px; font-size:15px; font-weight:600;">Contact</h4>
                    <p style="margin:2px 0; font-size:13px; opacity:0.5; display:flex; align-items:center; gap:8px;">
                        ${Icons.phone} ${settings.storePhone || '+234 801 234 5678'}
                    </p>
                    <p style="margin:2px 0; font-size:13px; opacity:0.5; display:flex; align-items:center; gap:8px;">
                        ${Icons.mail} ${settings.storeEmail || 'support@tadaa.com'}
                    </p>
                    ${settings.storeAddress ? `<p style="margin:2px 0; font-size:13px; opacity:0.5;">${settings.storeAddress}</p>` : ''}
                    <p style="margin:2px 0; font-size:13px; opacity:0.5;">${settings.businessHours || 'Mon-Fri: 9am - 6pm'}</p>
                </div>
            </div>
            
            <!-- Copyright -->
            <div style="text-align:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:20px; margin-top:28px;">
                <p style="margin:0; font-size:12px; opacity:0.3;">&copy; 2026 Tadaa! Marketplace. All rights reserved.</p>
            </div>
        </footer>
    `;
}

// ============================================
// MAKE FUNCTIONS GLOBAL
// ============================================
window.filterByCategory = filterByCategory;
window.scrollToProducts = scrollToProducts;
window.scrollToCategories = scrollToCategories;
window.toggleSearch = toggleSearch;
window.toggleCartSidebar = toggleCartSidebar;
window.addToCart = addToCart;
window.viewProduct = viewProduct;
window.filterProducts = filterProducts;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.checkout = checkout;
window.showToast = showToast;
window.updateProductQuantity = updateProductQuantity;
window.changeModalQty = changeModalQty;
window.addModalToCart = addModalToCart;
window.closeModal = closeModal;
window.closeCartSidebar = closeCartSidebar;
window.toggleTheme = toggleTheme;
window.toggleWishlist = toggleWishlist;
window.renderWishlistPage = renderWishlistPage;

// ============================================
// DETECT BROWSER & SHOW INSTALL INSTRUCTIONS
// ============================================
function getBrowserInfo() {
    const ua = navigator.userAgent;
    const isSamsung = ua.includes('Samsung') || ua.includes('SM-');
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isChrome = /chrome/i.test(ua) && !ua.includes('Samsung');
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);
    return { isSamsung, isSafari, isChrome, isIOS, isAndroid };
}

function showInstallInstructions() {
    const browser = getBrowserInfo();
    const banner = document.getElementById('installBanner');
    if (!banner) return;
    if (window.matchMedia('(display-mode: standalone)').matches) {
        banner.classList.remove('show');
        return;
    }
    if (browser.isSamsung || browser.isSafari || browser.isIOS) {
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.textContent = 'Install App';
            installBtn.onclick = function() {
                const instructions = document.createElement('div');
                instructions.id = 'installInstructions';
                instructions.style.cssText = `
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.85); backdrop-filter: blur(20px);
                    z-index: 10000; display: flex; align-items: center;
                    justify-content: center; padding: 20px;
                `;
                instructions.innerHTML = `
                    <div style="background: #fff; border-radius: 28px; max-width: 400px; width: 100%; padding: 36px 32px; text-align: center; position: relative; box-shadow: 0 24px 80px rgba(0,0,0,0.3);">
                        <button onclick="this.closest('#installInstructions').remove()" style="position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">✕</button>
                        <div style="font-size: 52px; margin-bottom: 12px;">📱</div>
                        <h2 class="tadaa-title" style="font-size: 26px; color: #000; margin: 0 0 6px;">Install Tadaa!</h2>
                        <p style="color: #666; margin-bottom: 24px; line-height: 1.6; font-family: 'Inter', sans-serif; font-size: 15px;">Get the full app experience on your device</p>
                        <div style="text-align: left; background: #f5f5f5; padding: 20px; border-radius: 16px; margin-bottom: 24px;">
                            <p style="font-weight: 600; margin: 0 0 10px; color: #000; font-family: 'Inter', sans-serif; font-size: 14px;">${browser.isSafari || browser.isIOS ? '📲 On iPhone/iPad:' : '📲 On Samsung Internet:'}</p>
                            <ol style="margin: 0; padding-left: 20px; color: #444; line-height: 2.2; font-family: 'Inter', sans-serif; font-size: 14px;">
                                ${browser.isSafari || browser.isIOS ? `
                                    <li>Tap the <strong>Share</strong> icon <span style="font-size:18px;">⬆️</span></li>
                                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                                    <li>Tap <strong>"Add"</strong> in the top right</li>
                                ` : `
                                    <li>Tap the <strong>☰</strong> menu icon</li>
                                    <li>Select <strong>"Add to Home Screen"</strong></li>
                                    <li>Tap <strong>"Add"</strong> to install</li>
                                `}
                            </ol>
                        </div>
                        <button onclick="this.closest('#installInstructions').remove()" style="background: linear-gradient(135deg, #FFD400 0%, #E6BF00 100%); color: #000; border: none; padding: 14px 40px; border-radius: 14px; font-weight: 600; font-size: 16px; cursor: pointer; font-family: 'Inter', sans-serif; box-shadow: 0 4px 20px rgba(255, 212, 0, 0.3);">Got it!</button>
                    </div>
                `;
                document.body.appendChild(instructions);
            };
        }
        banner.classList.add('show');
        return true;
    }
    return false;
}

// ============================================
// TRACK ORDER FUNCTIONS
// ============================================
function findOrdersByPhone() {
    const input = document.getElementById('trackPhoneInput');
    const error = document.getElementById('trackError');
    const phone = input?.value?.trim();
    if (!phone) {
        if (error) { error.textContent = 'Please enter your phone number'; error.style.display = 'block'; }
        return;
    }
    const phoneClean = phone.replace(/\s/g, '');
    if (!phoneClean.match(/^0[789][01]\d{8}$|^\+234[789][01]\d{8}$/)) {
        if (error) { error.textContent = 'Please enter a valid phone number (e.g., 08012345678)'; error.style.display = 'block'; }
        return;
    }
    if (error) { error.style.display = 'none'; }
    window.location.href = `./tracking.html?phone=${encodeURIComponent(phone)}`;
}

function trackByOrderId() {
    const input = document.getElementById('trackOrderInput');
    const error = document.getElementById('trackError');
    const orderId = input?.value?.trim();
    if (!orderId) {
        if (error) { error.textContent = 'Please enter your Order ID'; error.style.display = 'block'; }
        return;
    }
    if (!orderId.startsWith('TAD-')) {
        if (error) { error.textContent = 'Please enter a valid Order ID (e.g., TAD-20260716-123456)'; error.style.display = 'block'; }
        return;
    }
    if (error) { error.style.display = 'none'; }
    window.location.href = `./tracking.html?order=${orderId}`;
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadData();
});

console.log('✅ Tadaa! Website with premium UI, working Wishlist, and luxury footer ready!');
