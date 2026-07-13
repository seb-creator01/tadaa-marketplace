// ============================================
// TADAA! - CUSTOMER WEBSITE (COMPLETE)
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
let currentCategory = 'all';
let searchTerm = '';

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
        if (themeToggle) themeToggle.textContent = '🌙';
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggle) themeToggle.textContent = '🌙';
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
            <div style="max-width:500px; width:100%; background:var(--bg-card); border-radius:24px; padding:48px 40px; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.5);">
                <div style="font-size:64px; margin-bottom:16px;">🔧</div>
                <h1 style="font-family:'Cormorant Garamond', serif; font-size:32px; color:var(--text-primary); margin:0 0 8px;">Store Under Maintenance</h1>
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
}

// ============================================
// LOAD DATA
// ============================================
async function loadData() {
    try {
        loadCart();
        
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
        
        console.log('✅ Data loaded - Categories:', categories.length, 'Products:', products.length);
        
        renderWebsite();
        updateCartCount();
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        if (appContainer) {
            appContainer.innerHTML = `
                <div style="text-align:center; padding:60px 20px;">
                    <h2 style="color:var(--text-primary);">😅 Oops! Something went wrong</h2>
                    <p style="color:var(--text-secondary);">Please refresh the page and try again.</p>
                    <button onclick="location.reload()" style="background:#FFD700; border:none; padding:12px 24px; border-radius:50px; margin-top:20px; cursor:pointer; font-weight:600;">Refresh</button>
                </div>
            `;
        }
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
        <nav style="background:#000; color:#fff; padding:16px 20px; position:sticky; top:0; z-index:100;">
            <div style="max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <span style="font-family:'Cormorant Garamond', serif; font-size:24px; font-weight:700; color:#FFD700; cursor:pointer;" onclick="location.reload()">Tadaa<span style="color:#fff;">!</span></span>
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <button onclick="toggleSearch()" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">🔍</button>
                    <button onclick="toggleTheme()" id="themeToggle" style="background:none; border:none; color:#fff; font-size:22px; cursor:pointer; padding:4px 8px; border-radius:50%;">🌙</button>
                    <button onclick="toggleCartSidebar()" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer; position:relative;">
                        🛒
                        <span id="cartCount" style="position:absolute; top:-8px; right:-12px; background:#FFD700; color:#000; font-size:10px; padding:2px 6px; border-radius:50%; font-weight:700; display:none;">0</span>
                    </button>
                </div>
            </div>
            <div id="searchBar" style="display:none; margin-top:12px;">
                <input type="text" id="searchInput" placeholder="Search products..." 
                       style="width:100%; padding:12px 16px; border-radius:12px; border:2px solid #FFD700; font-size:16px; background:#1a1a1a; color:#fff;">
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
// RENDER HERO
// ============================================
function renderHero() {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;
    heroSection.innerHTML = `
        <div style="background:linear-gradient(135deg, #000 0%, #1a1a1a 100%); padding:60px 20px; text-align:center; position:relative; overflow:hidden; border-radius:0 0 40px 40px;">
            <div style="position:absolute; top:-100px; right:-100px; width:300px; height:300px; background:rgba(255,215,0,0.05); border-radius:50%;"></div>
            <div style="position:absolute; bottom:-100px; left:-100px; width:300px; height:300px; background:rgba(255,215,0,0.05); border-radius:50%;"></div>
            <div class="animate-fade-up" style="max-width:800px; margin:0 auto; position:relative; z-index:1;">
                <h1 style="font-family:'Cormorant Garamond', serif; font-size:48px; color:#FFD700; margin:0;">
                    Welcome to <span style="color:#FFD700;">Tadaa</span><span style="color:#fff;">!</span>
                </h1>
                <p style="font-size:20px; color:#9CA3AF; margin:16px 0 32px; font-family:'Cormorant Garamond', serif;">
                    ${settings.announcementBanner || 'Your premium online marketplace'}
                </p>
                <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                    <button onclick="scrollToProducts()" class="btn btn-primary" style="background:#FFD700; color:#000; border:none; padding:14px 32px; border-radius:50px; font-size:16px; font-weight:600; cursor:pointer;">🛍️ Shop Now</button>
                    <button onclick="scrollToCategories()" class="btn btn-outline" style="background:transparent; color:#FFD700; border:2px solid #FFD700; padding:14px 32px; border-radius:50px; font-size:16px; font-weight:600; cursor:pointer;">Browse Categories</button>
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
            <div style="background:#FFD700; padding:12px 20px; text-align:center; color:#000; font-weight:600; border-radius:12px; margin:16px 20px;">
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
            <h2 style="font-family:'Cormorant Garamond', serif; font-size:28px; color:var(--text-primary); margin-bottom:20px;">📂 Categories</h2>
            <div style="display:flex; gap:12px; overflow-x:auto; padding-bottom:12px; scrollbar-width:none;">
                <button onclick="filterByCategory('all')" class="category-btn" style="padding:10px 20px; border-radius:50px; border:2px solid #FFD700; background:${currentCategory === 'all' ? '#FFD700' : 'transparent'}; color:${currentCategory === 'all' ? '#000' : 'var(--text-primary)'}; cursor:pointer; white-space:nowrap; font-weight:600; transition:all 0.3s ease; flex-shrink:0;">
                    All
                </button>
    `;
    categories.forEach(cat => {
        const isActive = currentCategory === cat.id;
        html += `
            <button onclick="filterByCategory('${cat.id}')" class="category-btn" style="padding:10px 20px; border-radius:50px; border:2px solid ${isActive ? '#FFD700' : 'var(--border-color)'}; background:${isActive ? '#FFD700' : 'transparent'}; color:${isActive ? '#000' : 'var(--text-primary)'}; cursor:pointer; white-space:nowrap; font-weight:${isActive ? '700' : '400'}; transition:all 0.3s ease; flex-shrink:0;">
                ${cat.icon || ''} ${cat.name}
            </button>
        `;
    });
    html += `</div></div>`;
    categoriesDiv.innerHTML = html;
}

// ============================================
// RENDER PRODUCTS
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
            <div style="max-width:1200px; margin:0 auto; padding:40px 20px; text-align:center; color:var(--text-secondary);">
                <p style="font-size:48px; margin-bottom:16px;">🛍️</p>
                <p style="font-size:20px;">No products found</p>
                <button onclick="filterByCategory('all'); searchTerm=''; document.getElementById('searchInput').value=''; filterProducts();" style="background:#FFD700; border:none; padding:10px 24px; border-radius:50px; margin-top:16px; cursor:pointer; font-weight:600;">Show All Products</button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="max-width:1200px; margin:0 auto; padding:0 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:8px;">
                <h2 style="font-family:'Cormorant Garamond', serif; font-size:22px; color:var(--text-primary); margin:0;">🛍️ Products</h2>
                <span style="color:var(--text-secondary); font-size:13px;">${filteredProducts.length} products</span>
            </div>
            <div class="stagger-children" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:12px;">
    `;
    
    filteredProducts.forEach((product, index) => {
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
        const inStock = product.inStock !== false && (product.stockCount || 0) > 0;
        const discount = product.discount || 0;
        const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
        const cartItem = cart.find(item => item.id === product.id);
        const qty = cartItem ? cartItem.quantity : 0;
        const productDeliveryFee = product.deliveryFee || settings.deliveryFee || 100;
        const deliveryDisplay = productDeliveryFee > 0 ? `Delivery: ₦${productDeliveryFee}/item` : 'Free Delivery';
        
        html += `
            <div class="product-card" style="background:var(--bg-card); border-radius:12px; overflow:hidden; box-shadow:var(--shadow-sm); border:1px solid var(--border-color); cursor:pointer; transition:all 0.3s cubic-bezier(0.4,0,0.2,1);" onclick="viewProduct('${product.id}')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'">
                <div style="position:relative; padding-bottom:100%; background:#f3f4f6;">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${product.name}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease;" loading="lazy">` : '<div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:32px;">📷</div>'}
                    ${discount > 0 ? `<div style="position:absolute; top:6px; right:6px; background:#EF4444; color:#fff; padding:2px 8px; border-radius:50px; font-size:10px; font-weight:700;">${discount}% OFF</div>` : ''}
                    ${!inStock ? `<div style="position:absolute; bottom:6px; left:6px; right:6px; background:rgba(0,0,0,0.7); color:#fff; text-align:center; padding:3px; border-radius:6px; font-size:10px;">Out of Stock</div>` : ''}
                    ${qty > 0 ? `<div style="position:absolute; top:6px; left:6px; background:#10B981; color:#fff; padding:2px 8px; border-radius:50px; font-size:9px; font-weight:700;">${qty} in Cart</div>` : ''}
                </div>
                
                <div style="padding:10px;">
                    <h3 style="font-size:13px; font-weight:600; margin:0 0 2px; color:var(--text-primary); line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${product.name}</h3>
                    <p style="font-size:10px; color:var(--text-secondary); margin:0 0 4px;">${product.categoryName || 'Uncategorized'}</p>
                    
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                        <span style="font-size:16px; font-weight:700; color:var(--text-primary);">₦${Math.round(discountedPrice).toLocaleString()}</span>
                        ${discount > 0 ? `<span style="font-size:10px; color:var(--text-muted); text-decoration:line-through;">₦${product.price.toLocaleString()}</span>` : ''}
                    </div>
                    
                    <div style="font-size:9px; color:var(--text-secondary); margin-bottom:4px;">
                        🚚 ${deliveryDisplay}
                    </div>
                    
                    ${inStock ? `
                    <div style="font-size:10px; color:var(--text-secondary); margin-top:4px; margin-bottom:2px; font-weight:600;">Qty</div>
                    <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
                        <button onclick="event.stopPropagation(); updateProductQuantity('${product.id}', -1)" style="background:var(--bg-input); border:1px solid var(--border-color); padding:4px 10px; border-radius:6px; cursor:pointer; font-size:14px; font-weight:700; color:var(--text-primary); transition:all 0.2s; ${qty === 0 ? 'opacity:0.4; cursor:not-allowed;' : ''}" ${qty === 0 ? 'disabled' : ''}>−</button>
                        <span style="min-width:24px; text-align:center; font-size:14px; font-weight:600; color:var(--text-primary);">${qty}</span>
                        <button onclick="event.stopPropagation(); updateProductQuantity('${product.id}', 1)" style="background:var(--bg-input); border:1px solid var(--border-color); padding:4px 10px; border-radius:6px; cursor:pointer; font-size:14px; font-weight:700; color:var(--text-primary); transition:all 0.2s;">+</button>
                        <button onclick="event.stopPropagation(); addToCart('${product.id}')" style="flex:1; background:#FFD700; color:#000; border:none; padding:4px 8px; border-radius:6px; font-weight:600; font-size:11px; cursor:pointer; transition:background 0.2s; min-width:50px;" onmouseover="this.style.background='#E6C200'" onmouseout="this.style.background='#FFD700'">
                            ${qty > 0 ? '🔄 Update' : 'Add +'}
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
    renderProducts();
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
    // Close any existing modal first
    closeModal();
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
    const discount = product.discount || 0;
    const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
    const inStock = product.inStock !== false && (product.stockCount || 0) > 0;
    const maxStock = product.stockCount || 999;
    const productDeliveryFee = product.deliveryFee || settings.deliveryFee || 100;
    
    const modal = document.createElement('div');
    modal.id = 'productModal';
    modal.style.cssText = `position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.7); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;`;
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal();
        }
    };
    
    modal.innerHTML = `
        <div style="background:var(--bg-card); border-radius:24px; max-width:500px; width:100%; max-height:90vh; overflow-y:auto; padding:24px; position:relative; animation:fadeInScale 0.3s ease;">
            <button onclick="closeModal()" style="position:absolute; top:12px; right:16px; background:none; border:none; font-size:24px; cursor:pointer; color:var(--text-secondary);">✕</button>
            <div style="border-radius:16px; overflow:hidden; background:#f3f4f6; margin-bottom:16px;">
                ${imageUrl ? `<img src="${imageUrl}" alt="${product.name}" style="width:100%; height:auto; max-height:300px; object-fit:cover;">` : '<div style="padding:60px; text-align:center; font-size:48px;">📷</div>'}
            </div>
            <h2 style="font-family:'Cormorant Garamond', serif; font-size:24px; margin:0 0 8px; color:var(--text-primary);">${product.name}</h2>
            <p style="color:var(--text-secondary); margin:0 0 12px;">${product.categoryName || 'Uncategorized'}</p>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                <span style="font-size:28px; font-weight:700; color:var(--text-primary);">₦${Math.round(discountedPrice).toLocaleString()}</span>
                ${discount > 0 ? `<span style="font-size:16px; color:var(--text-muted); text-decoration:line-through;">₦${product.price.toLocaleString()}</span>` : ''}
                ${discount > 0 ? `<span style="background:#EF4444; color:#fff; padding:2px 12px; border-radius:50px; font-size:12px; font-weight:700;">${discount}% OFF</span>` : ''}
            </div>
            <p style="color:var(--text-secondary); margin:0 0 16px;">${product.description || 'No description available.'}</p>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <span style="color:var(--text-secondary); font-size:14px;">Stock: ${inStock ? `✅ ${product.stockCount || 0} available` : '❌ Out of Stock'}</span>
            </div>
            <div style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">
                🚚 Delivery: ₦${productDeliveryFee}/item
            </div>
            ${inStock ? `
            <div style="margin:16px 0;">
                <div style="font-size:14px; font-weight:600; margin-bottom:8px; color:var(--text-primary);">Quantity</div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <button onclick="changeModalQty('${product.id}', -1)" style="background:var(--bg-input); border:2px solid var(--border-color); padding:8px 18px; border-radius:8px; cursor:pointer; font-size:22px; font-weight:700; color:var(--text-primary); transition:all 0.2s;">−</button>
                    <span id="modal-qty-display-${product.id}" style="min-width:40px; text-align:center; font-size:22px; font-weight:700; color:var(--text-primary);">1</span>
                    <button onclick="changeModalQty('${product.id}', 1)" style="background:var(--bg-input); border:2px solid var(--border-color); padding:8px 18px; border-radius:8px; cursor:pointer; font-size:22px; font-weight:700; color:var(--text-primary); transition:all 0.2s;">+</button>
                </div>
            </div>
            <button onclick="addModalToCart('${product.id}')" style="width:100%; background:#FFD700; color:#000; border:none; padding:14px; border-radius:12px; font-size:18px; font-weight:600; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#E6C200'" onmouseout="this.style.background='#FFD700'">🛒 Add to Cart</button>
            ` : `<button style="width:100%; background:#9CA3AF; color:#fff; border:none; padding:14px; border-radius:12px; font-size:18px; font-weight:600; cursor:not-allowed;">Out of Stock</button>`}
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
// ADD TO CART FROM MODAL - FIXED
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
    
    // CLOSE MODAL FIRST - THIS IS THE FIX
    closeModal();
    
    // THEN UPDATE UI
    renderCartSidebarContent();
    renderProducts();
    showToast(product.name);
}

// ============================================
// CLOSE MODAL - COMPLETE CLEANUP
// ============================================
function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
    }
    
    // Remove any leftover overlays
    document.querySelectorAll('.modal-overlay, .modal-backdrop').forEach(el => el.remove());
    
    // Restore body scroll
    document.body.style.overflow = '';
    document.body.style.position = '';
    
    // Reset any inline styles
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
        position:fixed; bottom:20px; right:20px; background:var(--toast-bg); color:var(--toast-text); padding:16px 20px; border-radius:16px; box-shadow:0 8px 32px var(--shadow-lg); z-index:2000; max-width:380px; width:100%; border-left:4px solid #FFD700;
    `;
    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:24px;">🛒</span>
            <div style="flex:1;">
                <p style="margin:0; font-weight:600;">Added to Cart!</p>
                <p style="margin:0; font-size:14px; color:var(--text-secondary);">${productName}</p>
            </div>
            <button onclick="this.closest('.toast-notification').remove()" style="background:none; border:none; font-size:20px; cursor:pointer; color:var(--text-muted);">✕</button>
        </div>
        <div style="display:flex; gap:8px; margin-top:12px;">
            <button onclick="this.closest('.toast-notification').remove(); toggleCartSidebar();" style="flex:1; background:#FFD700; color:#000; border:none; padding:8px; border-radius:8px; font-weight:600; cursor:pointer;">🛒 View Cart</button>
            <button onclick="this.closest('.toast-notification').remove();" style="flex:1; background:var(--bg-input); color:var(--text-primary); border:1px solid var(--border-color); padding:8px; border-radius:8px; font-weight:600; cursor:pointer;">🛍️ Continue Shopping</button>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 5000);
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
    renderProducts();
    showToast(product.name);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartSidebarContent();
    renderProducts();
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
    renderProducts();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Clear your entire cart?')) {
        cart = [];
        saveCart();
        updateCartCount();
        renderCartSidebarContent();
        renderProducts();
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
        sidebar.style.cssText = `position:fixed; top:0; right:-400px; width:380px; height:100%; background:var(--bg-card); z-index:1500; transition:right 0.4s cubic-bezier(0.4,0,0.2,1); box-shadow:-4px 0 24px var(--shadow-color); display:flex; flex-direction:column;`;
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
            <div style="padding:20px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; font-family:'Cormorant Garamond', serif; color:var(--text-primary);">🛒 Your Cart</h3>
                <button onclick="closeCartSidebar()" style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--text-secondary);">✕</button>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px; color:var(--text-secondary); text-align:center;">
                <p style="font-size:48px; margin:0 0 16px;">🛒</p>
                <p style="font-size:18px; margin:0;">Your cart is empty</p>
                <button onclick="closeCartSidebar()" style="background:#FFD700; color:#000; border:none; padding:12px 24px; border-radius:50px; margin-top:16px; cursor:pointer; font-weight:600;">Continue Shopping</button>
            </div>
        `;
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let totalDelivery = 0;
    cart.forEach(item => {
        const productDeliveryFee = item.deliveryFee || settings.deliveryFee || 100;
        totalDelivery += productDeliveryFee * item.quantity;
    });
    
    const freeThreshold = settings.freeDeliveryThreshold || 5000;
    const freeDeliveryEnabled = settings.freeDeliveryEnabled || false;
    const isFreeDelivery = freeDeliveryEnabled && freeThreshold > 0 && subtotal >= freeThreshold;
    const deliveryCharge = isFreeDelivery ? 0 : totalDelivery;
    const total = subtotal + deliveryCharge;
    const remainingForFree = freeThreshold - subtotal;
    
    let cartHtml = `
        <div style="padding:20px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
            <h3 style="margin:0; font-family:'Cormorant Garamond', serif; color:var(--text-primary);">🛒 Your Cart</h3>
            <div style="display:flex; align-items:center; gap:12px;">
                <button onclick="clearCart()" style="background:none; border:none; color:#EF4444; font-size:14px; cursor:pointer; text-decoration:underline;">Clear</button>
                <button onclick="closeCartSidebar()" style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--text-secondary);">✕</button>
            </div>
        </div>
        <div style="flex:1; overflow-y:auto; padding:16px 20px;">
    `;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const imageUrl = item.images && item.images.length > 0 ? item.images[0] : '';
        const itemDeliveryFee = item.deliveryFee || settings.deliveryFee || 100;
        cartHtml += `
            <div style="display:flex; gap:12px; padding:12px 0; border-bottom:1px solid var(--border-color);">
                <div style="width:60px; height:60px; border-radius:8px; overflow:hidden; background:#f3f4f6; flex-shrink:0;">
                    ${imageUrl ? `<img src="${imageUrl}" style="width:100%; height:100%; object-fit:cover;">` : '📷'}
                </div>
                <div style="flex:1; min-width:0;">
                    <p style="margin:0; font-weight:600; font-size:14px; color:var(--text-primary);">${item.name}</p>
                    <p style="margin:4px 0 0; font-size:14px; font-weight:700; color:var(--text-primary);">₦${item.price.toLocaleString()}</p>
                    <p style="margin:2px 0 0; font-size:11px; color:var(--text-secondary);">Delivery: ₦${itemDeliveryFee}/item</p>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
                        <button onclick="updateQuantity('${item.id}', -1)" style="background:var(--bg-input); border:1px solid var(--border-color); width:28px; height:28px; border-radius:50%; cursor:pointer; font-size:16px; color:var(--text-primary);">−</button>
                        <span style="font-weight:600; min-width:24px; text-align:center; color:var(--text-primary);">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" style="background:var(--bg-input); border:1px solid var(--border-color); width:28px; height:28px; border-radius:50%; cursor:pointer; font-size:16px; color:var(--text-primary);">+</button>
                        <span style="margin-left:auto; font-weight:600; color:var(--text-primary);">₦${itemTotal.toLocaleString()}</span>
                        <button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:#EF4444; cursor:pointer; font-size:18px; margin-left:4px;">✕</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartHtml += `
        </div>
        <div style="padding:16px 20px; border-top:2px solid var(--border-color); flex-shrink:0; background:var(--bg-input); border-radius:0 0 16px 16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span style="color:var(--text-secondary);">Subtotal</span>
                <span style="font-weight:600; color:var(--text-primary);">₦${subtotal.toLocaleString()}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span style="color:var(--text-secondary);">Delivery</span>
                <span style="font-weight:600; color:var(--text-primary);">${isFreeDelivery ? '🎉 FREE' : `₦${deliveryCharge.toLocaleString()}`}</span>
            </div>
            ${isFreeDelivery ? `<div style="background:#D1FAE5; color:#065F46; padding:8px 12px; border-radius:8px; margin-bottom:8px; text-align:center; font-size:14px; font-weight:600;">🎉 You qualify for FREE delivery!</div>` : ''}
            ${!isFreeDelivery && freeDeliveryEnabled && remainingForFree > 0 ? `<div style="background:#FEF3C7; color:#92400E; padding:8px 12px; border-radius:8px; margin-bottom:8px; text-align:center; font-size:13px;">Add ₦${remainingForFree.toLocaleString()} more for FREE delivery</div>` : ''}
            <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:700; border-top:2px solid var(--border-color); padding-top:12px; margin-top:8px;">
                <span style="color:var(--text-secondary);">Total</span>
                <span style="color:#FFD700; font-size:22px;">₦${total.toLocaleString()}</span>
            </div>
            <button onclick="closeCartSidebar(); checkout();" style="width:100%; background:#FFD700; color:#000; border:none; padding:14px; border-radius:12px; font-size:18px; font-weight:700; cursor:pointer; margin-top:12px;" onmouseover="this.style.background='#E6C200'" onmouseout="this.style.background='#FFD700'">
                🛒 Proceed to Checkout →
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
    window.location.href = '/tadaa-marketplace/checkout.html';
}

// ============================================
// RENDER FOOTER
// ============================================
function renderFooter() {
    if (!mainFooter) return;
    mainFooter.innerHTML = `
        <footer style="background:#000; color:#9CA3AF; padding:40px 20px; margin-top:40px; border-radius:40px 40px 0 0;">
            <div style="max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:32px;">
                <div>
                    <h3 style="color:#FFD700; font-family:'Cormorant Garamond', serif; font-size:20px; margin:0 0 12px;">Tadaa!</h3>
                    <p style="margin:0;">Your premium online marketplace</p>
                </div>
                <div>
                    <h4 style="color:#fff; margin:0 0 8px;">Contact</h4>
                    <p style="margin:4px 0;">📞 ${settings.storePhone || '+2348012345678'}</p>
                    <p style="margin:4px 0;">✉️ ${settings.storeEmail || 'support@tadaa.com'}</p>
                    ${settings.storeWhatsApp ? `<p style="margin:4px 0;">💬 ${settings.storeWhatsApp}</p>` : ''}
                </div>
                <div>
                    <h4 style="color:#fff; margin:0 0 8px;">Address</h4>
                    <p style="margin:4px 0;">${settings.storeAddress || 'Lagos, Nigeria'}</p>
                </div>
                <div>
                    <h4 style="color:#fff; margin:0 0 8px;">Hours</h4>
                    <p style="margin:4px 0;">${settings.businessHours || 'Mon-Fri: 9am - 6pm'}</p>
                </div>
            </div>
            <div style="text-align:center; border-top:1px solid #1a1a1a; padding-top:20px; margin-top:20px;">
                <p style="margin:0; font-size:14px;">© 2026 Tadaa! Marketplace. All rights reserved.</p>
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

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadData();
});

console.log('✅ Tadaa! Website with modal fix ready!');
