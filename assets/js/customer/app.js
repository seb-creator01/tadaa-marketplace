// ============================================
// TADAA! - CUSTOMER WEBSITE WITH PREMIUM CART
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
const mainContent = document.getElementById('main-content');
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
let discountCode = '';
let discountApplied = 0;

// ============================================
// LOAD CART FROM STORAGE
// ============================================
function loadCart() {
    try {
        const saved = localStorage.getItem('tadaa_cart');
        if (saved) {
            cart = JSON.parse(saved);
            console.log('📦 Cart loaded from storage:', cart.length, 'items');
        }
    } catch (e) {
        console.error('Error loading cart:', e);
        cart = [];
    }
}

// ============================================
// SAVE CART TO STORAGE
// ============================================
function saveCart() {
    try {
        localStorage.setItem('tadaa_cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// ============================================
// LOAD DATA
// ============================================
async function loadData() {
    try {
        loadCart();
        
        const settingsDoc = await db.collection('siteSettings').doc('settings').get();
        settings = settingsDoc.data() || {};
        window.tadaaSettings = settings; // Make settings available globally
        
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
        
        console.log('✅ Data loaded:', {
            settings: settings.storeName,
            categories: categories.length,
            products: products.length,
            cart: cart.length
        });
        
        renderWebsite();
        updateCartCount();
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align:center; padding:60px 20px;">
                    <h2>😅 Oops! Something went wrong</h2>
                    <p style="color:#6B7280;">We're having trouble loading the store. Please try again later.</p>
                    <button onclick="location.reload()" style="background:#FFD700; border:none; padding:12px 24px; border-radius:50px; margin-top:20px; cursor:pointer;">Refresh Page</button>
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
    renderCartSidebar();
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
                <div style="display:flex; align-items:center; gap:16px;">
                    <button onclick="toggleSearch()" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">🔍</button>
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
            <div style="max-width:800px; margin:0 auto; position:relative; z-index:1;">
                <h1 style="font-family:'Cormorant Garamond', serif; font-size:48px; color:#FFD700; margin:0;">
                    Welcome to <span style="color:#FFD700;">Tadaa</span><span style="color:#fff;">!</span>
                </h1>
                <p style="font-size:20px; color:#9CA3AF; margin:16px 0 32px; font-family:'Cormorant Garamond', serif;">
                    ${settings.announcementBanner || 'Your premium online marketplace'}
                </p>
                <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                    <button onclick="scrollToProducts()" style="background:#FFD700; color:#000; border:none; padding:14px 32px; border-radius:50px; font-size:16px; font-weight:600; cursor:pointer; transition:transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        🛍️ Shop Now
                    </button>
                    <button onclick="scrollToCategories()" style="background:transparent; color:#FFD700; border:2px solid #FFD700; padding:14px 32px; border-radius:50px; font-size:16px; font-weight:600; cursor:pointer; transition:transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Browse Categories
                    </button>
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
        categoriesDiv.innerHTML = `
            <div style="padding:20px; text-align:center; color:#6B7280;">
                <p>No categories available yet.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="max-width:1200px; margin:0 auto; padding:0 20px;">
            <h2 style="font-family:'Cormorant Garamond', serif; font-size:28px; color:#1F2937; margin-bottom:20px;">📂 Categories</h2>
            <div style="display:flex; gap:12px; overflow-x:auto; padding-bottom:12px; scrollbar-width:none; -webkit-overflow-scrolling:touch;">
                <button onclick="filterByCategory('all')" class="category-btn" style="padding:10px 20px; border-radius:50px; border:2px solid #FFD700; background:${currentCategory === 'all' ? '#FFD700' : 'transparent'}; color:${currentCategory === 'all' ? '#000' : '#1F2937'}; cursor:pointer; white-space:nowrap; font-weight:600; transition:all 0.3s; flex-shrink:0;">
                    All
                </button>
    `;
    
    categories.forEach(cat => {
        const isActive = currentCategory === cat.id;
        html += `
            <button onclick="filterByCategory('${cat.id}')" class="category-btn" style="padding:10px 20px; border-radius:50px; border:2px solid ${isActive ? '#FFD700' : '#E5E7EB'}; background:${isActive ? '#FFD700' : 'transparent'}; color:${isActive ? '#000' : '#1F2937'}; cursor:pointer; white-space:nowrap; font-weight:${isActive ? '700' : '400'}; transition:all 0.3s; flex-shrink:0;">
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
            <div style="max-width:1200px; margin:0 auto; padding:40px 20px; text-align:center; color:#6B7280;">
                <p style="font-size:48px; margin-bottom:16px;">🛍️</p>
                <p style="font-size:20px;">No products found</p>
                <p>Try adjusting your search or filter</p>
                <button onclick="filterByCategory('all'); searchTerm=''; document.getElementById('searchInput').value=''; filterProducts();" style="background:#FFD700; border:none; padding:10px 24px; border-radius:50px; margin-top:16px; cursor:pointer; font-weight:600;">Show All Products</button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="max-width:1200px; margin:0 auto; padding:0 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
                <h2 style="font-family:'Cormorant Garamond', serif; font-size:28px; color:#1F2937; margin:0;">🛍️ Products</h2>
                <span style="color:#6B7280; font-size:14px;">${filteredProducts.length} products</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:16px;">
    `;
    
    filteredProducts.forEach(product => {
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
        const inStock = product.inStock !== false && (product.stockCount || 0) > 0;
        const discount = product.discount || 0;
        const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
        const inCart = cart.find(item => item.id === product.id);
        
        html += `
            <div style="background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); transition:transform 0.3s, box-shadow 0.3s; cursor:pointer;" onclick="viewProduct('${product.id}')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.06)'">
                <div style="position:relative; padding-bottom:100%; background:#f3f4f6;">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${product.name}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; transition:transform 0.3s;" loading="lazy">` : '<div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:40px;">📷</div>'}
                    ${discount > 0 ? `<div style="position:absolute; top:8px; right:8px; background:#EF4444; color:#fff; padding:2px 10px; border-radius:50px; font-size:12px; font-weight:700;">${discount}% OFF</div>` : ''}
                    ${!inStock ? `<div style="position:absolute; bottom:8px; left:8px; right:8px; background:rgba(0,0,0,0.7); color:#fff; text-align:center; padding:4px; border-radius:8px; font-size:12px;">Out of Stock</div>` : ''}
                    ${inCart ? `<div style="position:absolute; top:8px; left:8px; background:#10B981; color:#fff; padding:2px 10px; border-radius:50px; font-size:10px; font-weight:700;">In Cart</div>` : ''}
                </div>
                <div style="padding:12px;">
                    <h3 style="font-size:14px; font-weight:600; margin:0 0 4px; color:#1F2937; line-height:1.3;">${product.name}</h3>
                    <p style="font-size:12px; color:#6B7280; margin:0 0 8px;">${product.categoryName || 'Uncategorized'}</p>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:18px; font-weight:700; color:#000;">₦${Math.round(discountedPrice).toLocaleString()}</span>
                        ${discount > 0 ? `<span style="font-size:12px; color:#9CA3AF; text-decoration:line-through;">₦${product.price.toLocaleString()}</span>` : ''}
                    </div>
                    ${inStock ? `<button onclick="event.stopPropagation(); addToCart('${product.id}')" style="width:100%; margin-top:8px; background:#FFD700; border:none; padding:8px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; transition:background 0.3s;" onmouseover="this.style.background='#E6C200'" onmouseout="this.style.background='#FFD700'">${inCart ? '🔄 Add More' : 'Add to Cart'}</button>` : ''}
                </div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    productsDiv.innerHTML = html;
}

// ============================================
// FILTER PRODUCTS
// ============================================
function filterProducts() {
    renderProducts();
}

function filterByCategory(categoryId) {
    currentCategory = categoryId;
    filterProducts();
    renderCategories();
}

// ============================================
// SCROLL FUNCTIONS
// ============================================
function scrollToProducts() {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToCategories() {
    document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
}

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
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
    const discount = product.discount || 0;
    const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
    const inStock = product.inStock !== false && (product.stockCount || 0) > 0;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.7); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn 0.3s;
    `;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    
    modal.innerHTML = `
        <div style="background:#fff; border-radius:24px; max-width:500px; width:100%; max-height:90vh; overflow-y:auto; padding:24px; position:relative; animation:slideUp 0.3s;">
            <button onclick="this.closest('div[style]').remove()" style="position:absolute; top:12px; right:16px; background:none; border:none; font-size:24px; cursor:pointer;">✕</button>
            
            <div style="border-radius:16px; overflow:hidden; background:#f3f4f6; margin-bottom:16px;">
                ${imageUrl ? `<img src="${imageUrl}" alt="${product.name}" style="width:100%; height:auto; max-height:300px; object-fit:cover;">` : '<div style="padding:60px; text-align:center; font-size:48px;">📷</div>'}
            </div>
            
            <h2 style="font-family:'Cormorant Garamond', serif; font-size:24px; margin:0 0 8px;">${product.name}</h2>
            <p style="color:#6B7280; margin:0 0 12px;">${product.categoryName || 'Uncategorized'}</p>
            
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                <span style="font-size:28px; font-weight:700; color:#000;">₦${Math.round(discountedPrice).toLocaleString()}</span>
                ${discount > 0 ? `<span style="font-size:16px; color:#9CA3AF; text-decoration:line-through;">₦${product.price.toLocaleString()}</span>` : ''}
                ${discount > 0 ? `<span style="background:#EF4444; color:#fff; padding:2px 12px; border-radius:50px; font-size:12px; font-weight:700;">${discount}% OFF</span>` : ''}
            </div>
            
            <p style="color:#6B7280; margin:0 0 16px;">${product.description || 'No description available.'}</p>
            
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <span style="color:#6B7280; font-size:14px;">Stock: ${inStock ? `✅ ${product.stockCount || 0} available` : '❌ Out of Stock'}</span>
            </div>
            
            ${inStock ? `<button onclick="event.stopPropagation(); addToCart('${product.id}'); this.closest('div[style]').remove();" style="width:100%; background:#FFD700; color:#000; border:none; padding:14px; border-radius:12px; font-size:18px; font-weight:600; cursor:pointer;">🛒 Add to Cart</button>` : `<button style="width:100%; background:#9CA3AF; color:#fff; border:none; padding:14px; border-radius:12px; font-size:18px; font-weight:600; cursor:not-allowed;">Out of Stock</button>`}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
    `;
    document.head.appendChild(style);
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(productName) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position:fixed; bottom:20px; right:20px; background:#fff; color:#1F2937; padding:16px 20px; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.2); z-index:2000; max-width:380px; width:100%; animation:slideUp 0.3s ease; border-left:4px solid #FFD700;
    `;
    
    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:24px;">🛒</span>
            <div style="flex:1;">
                <p style="margin:0; font-weight:600;">Added to Cart!</p>
                <p style="margin:0; font-size:14px; color:#6B7280;">${productName}</p>
            </div>
        </div>
        <div style="display:flex; gap:8px; margin-top:12px;">
            <button onclick="this.closest('div[style]').remove(); toggleCartSidebar();" style="flex:1; background:#FFD700; color:#000; border:none; padding:8px; border-radius:8px; font-weight:600; cursor:pointer;">View Cart</button>
            <button onclick="this.closest('div[style]').remove();" style="flex:1; background:#f3f4f6; color:#1F2937; border:none; padding:8px; border-radius:8px; font-weight:600; cursor:pointer;">Continue Shopping</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 5000);
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
    renderCartSidebar();
    showToast(product.name);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartSidebar();
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
    renderCartSidebar();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Clear your entire cart?')) {
        cart = [];
        saveCart();
        updateCartCount();
        renderCartSidebar();
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
// CART SIDEBAR
// ============================================
function renderCartSidebar() {
    let sidebar = document.getElementById('cartSidebar');
    if (!sidebar) {
        sidebar = document.createElement('div');
        sidebar.id = 'cartSidebar';
        sidebar.style.cssText = `
            position:fixed; top:0; right:-400px; width:380px; height:100%; background:#fff; z-index:1500; 
            transition:right 0.3s ease; box-shadow:-4px 0 24px rgba(0,0,0,0.15); 
            display:flex; flex-direction:column;
        `;
        document.body.appendChild(sidebar);
        
        const overlay = document.createElement('div');
        overlay.id = 'cartOverlay';
        overlay.style.cssText = `
            position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:1400; 
            display:none; cursor:pointer;
        `;
        overlay.onclick = toggleCartSidebar;
        document.body.appendChild(overlay);
    }
    
    const overlay = document.getElementById('cartOverlay');
    
    if (cart.length === 0) {
        sidebar.innerHTML = `
            <div style="padding:20px; border-bottom:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; font-family:'Cormorant Garamond', serif;">🛒 Your Cart</h3>
                <button onclick="toggleCartSidebar()" style="background:none; border:none; font-size:24px; cursor:pointer;">✕</button>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px; color:#9CA3AF; text-align:center;">
                <p style="font-size:48px; margin:0 0 16px;">🛒</p>
                <p style="font-size:18px; margin:0;">Your cart is empty</p>
                <p style="font-size:14px;">Start shopping to add items!</p>
                <button onclick="toggleCartSidebar()" style="background:#FFD700; color:#000; border:none; padding:12px 24px; border-radius:50px; margin-top:16px; cursor:pointer; font-weight:600;">Continue Shopping</button>
            </div>
        `;
        if (overlay) overlay.style.display = 'none';
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = settings.deliveryFee || 500;
    const freeThreshold = settings.freeDeliveryThreshold || 5000;
    const isFreeDelivery = freeThreshold > 0 && subtotal >= freeThreshold;
    const deliveryCharge = isFreeDelivery ? 0 : deliveryFee;
    const total = subtotal + deliveryCharge;
    const remainingForFree = freeThreshold - subtotal;
    
    let cartHtml = `
        <div style="padding:20px; border-bottom:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
            <h3 style="margin:0; font-family:'Cormorant Garamond', serif;">🛒 Your Cart</h3>
            <div style="display:flex; align-items:center; gap:12px;">
                <button onclick="clearCart()" style="background:none; border:none; color:#EF4444; font-size:14px; cursor:pointer; text-decoration:underline;">Clear</button>
                <button onclick="toggleCartSidebar()" style="background:none; border:none; font-size:24px; cursor:pointer;">✕</button>
            </div>
        </div>
        <div style="flex:1; overflow-y:auto; padding:16px 20px;">
    `;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const imageUrl = item.images && item.images.length > 0 ? item.images[0] : '';
        
        cartHtml += `
            <div style="display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #f3f4f6;">
                <div style="width:60px; height:60px; border-radius:8px; overflow:hidden; background:#f3f4f6; flex-shrink:0;">
                    ${imageUrl ? `<img src="${imageUrl}" style="width:100%; height:100%; object-fit:cover;">` : '📷'}
                </div>
                <div style="flex:1; min-width:0;">
                    <p style="margin:0; font-weight:600; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</p>
                    <p style="margin:4px 0 0; font-size:14px; font-weight:700;">₦${item.price.toLocaleString()}</p>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
                        <button onclick="updateQuantity('${item.id}', -1)" style="background:#f3f4f6; border:none; width:28px; height:28px; border-radius:50%; cursor:pointer; font-size:16px;">−</button>
                        <span style="font-weight:600; min-width:24px; text-align:center;">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" style="background:#f3f4f6; border:none; width:28px; height:28px; border-radius:50%; cursor:pointer; font-size:16px;">+</button>
                        <span style="margin-left:auto; font-weight:600;">₦${itemTotal.toLocaleString()}</span>
                        <button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:#EF4444; cursor:pointer; font-size:18px; margin-left:4px;">✕</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartHtml += `
        </div>
        <div style="padding:16px 20px; border-top:2px solid #e5e7eb; flex-shrink:0; background:#f9fafb; border-radius:0 0 16px 16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span style="color:#6B7280;">Subtotal</span>
                <span style="font-weight:600;">₦${subtotal.toLocaleString()}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span style="color:#6B7280;">Delivery</span>
                <span style="font-weight:600;">${isFreeDelivery ? '🎉 FREE' : `₦${deliveryFee.toLocaleString()}`}</span>
            </div>
            ${isFreeDelivery ? `<div style="background:#D1FAE5; color:#065F46; padding:8px 12px; border-radius:8px; margin-bottom:8px; text-align:center; font-size:14px; font-weight:600;">🎉 You qualify for FREE delivery!</div>` : ''}
            ${!isFreeDelivery && remainingForFree > 0 ? `<div style="background:#FEF3C7; color:#92400E; padding:8px 12px; border-radius:8px; margin-bottom:8px; text-align:center; font-size:13px;">Add ₦${remainingForFree.toLocaleString()} more for FREE delivery</div>` : ''}
            <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:700; border-top:2px solid #e5e7eb; padding-top:12px; margin-top:8px;">
                <span>Total</span>
                <span style="color:#FFD700; font-size:22px;">₦${total.toLocaleString()}</span>
            </div>
            <button onclick="checkout()" style="width:100%; background:#FFD700; color:#000; border:none; padding:14px; border-radius:12px; font-size:18px; font-weight:700; cursor:pointer; margin-top:12px; transition:background 0.3s;" onmouseover="this.style.background='#E6C200'" onmouseout="this.style.background='#FFD700'">
                Proceed to Checkout →
            </button>
        </div>
    `;
    
    sidebar.innerHTML = cartHtml;
    if (overlay) overlay.style.display = 'block';
}

// ============================================
// TOGGLE CART SIDEBAR
// ============================================
function toggleCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (!sidebar) return;
    
    if (sidebar.style.right === '0px') {
        sidebar.style.right = '-400px';
        if (overlay) overlay.style.display = 'none';
    } else {
        renderCartSidebar();
        sidebar.style.right = '0px';
        if (overlay) overlay.style.display = 'block';
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
    toggleCartSidebar();
    loadCheckoutPage();
}

// ============================================
// LOAD CHECKOUT PAGE
// ============================================
function loadCheckoutPage() {
    import('./checkout.js').then(module => {
        module.loadCheckoutPage();
    }).catch(err => {
        console.error('Error loading checkout:', err);
        alert('Error loading checkout page. Please try again.');
    });
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
window.loadCheckoutPage = loadCheckoutPage;
window.showToast = showToast;

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

console.log('✅ Tadaa! Customer website with premium cart and checkout ready!');
