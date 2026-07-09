// ============================================
// TADAA! - CUSTOMER WEBSITE
// Premium Online Marketplace
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

// ===== Initialize Firebase =====
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

// ============================================
// LOAD DATA
// ============================================
async function loadData() {
    try {
        // Load settings
        const settingsDoc = await db.collection('siteSettings').doc('settings').get();
        settings = settingsDoc.data() || {};
        
        // Load categories
        const categoriesSnap = await db.collection('categories').orderBy('order', 'asc').get();
        categories = [];
        categoriesSnap.forEach(doc => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        
        // Load products
        const productsSnap = await db.collection('products').orderBy('createdAt', 'desc').get();
        products = [];
        productsSnap.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        
        console.log('✅ Data loaded:', {
            settings: settings.storeName,
            categories: categories.length,
            products: products.length
        });
        
        renderWebsite();
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        mainContent.innerHTML = `
            <div style="text-align:center; padding:60px 20px;">
                <h2>😅 Oops! Something went wrong</h2>
                <p style="color:#6B7280;">We're having trouble loading the store. Please try again later.</p>
                <button onclick="location.reload()" style="background:#FFD700; border:none; padding:12px 24px; border-radius:50px; margin-top:20px; cursor:pointer;">Refresh Page</button>
            </div>
        `;
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
                    <span style="font-family:'Cormorant Garamond', serif; font-size:24px; font-weight:700; color:#FFD700;">Tadaa<span style="color:#fff;">!</span></span>
                </div>
                <div style="display:flex; align-items:center; gap:16px;">
                    <button onclick="toggleSearch()" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">🔍</button>
                    <button onclick="toggleCart()" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer; position:relative;">
                        🛒
                        <span id="cartCount" style="position:absolute; top:-8px; right:-12px; background:#FFD700; color:#000; font-size:10px; padding:2px 6px; border-radius:50%; font-weight:700; display:none;">0</span>
                    </button>
                </div>
            </div>
            <!-- Search Bar -->
            <div id="searchBar" style="display:none; margin-top:12px;">
                <input type="text" id="searchInput" placeholder="Search products..." 
                       style="width:100%; padding:12px 16px; border-radius:12px; border:2px solid #FFD700; font-size:16px; background:#1a1a1a; color:#fff;">
            </div>
        </nav>
    `;
    
    // Search functionality
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchTerm = e.target.value.toLowerCase();
                filterProducts();
            });
        }
    });
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
                    <button onclick="scrollToProducts()" style="background:#FFD700; color:#000; border:none; padding:14px 32px; border-radius:50px; font-size:16px; font-weight:600; cursor:pointer;">
                        🛍️ Shop Now
                    </button>
                    <button onclick="scrollToCategories()" style="background:transparent; color:#FFD700; border:2px solid #FFD700; padding:14px 32px; border-radius:50px; font-size:16px; font-weight:600; cursor:pointer;">
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
            <div style="display:flex; gap:12px; overflow-x:auto; padding-bottom:12px; scrollbar-width:none;">
                <button onclick="filterByCategory('all')" class="category-btn" style="padding:10px 20px; border-radius:50px; border:2px solid #FFD700; background:${currentCategory === 'all' ? '#FFD700' : 'transparent'}; color:${currentCategory === 'all' ? '#000' : '#1F2937'}; cursor:pointer; white-space:nowrap; font-weight:600; transition:all 0.3s;">
                    All
                </button>
    `;
    
    categories.forEach(cat => {
        const isActive = currentCategory === cat.id;
        html += `
            <button onclick="filterByCategory('${cat.id}')" class="category-btn" style="padding:10px 20px; border-radius:50px; border:2px solid ${isActive ? '#FFD700' : '#E5E7EB'}; background:${isActive ? '#FFD700' : 'transparent'}; color:${isActive ? '#000' : '#1F2937'}; cursor:pointer; white-space:nowrap; font-weight:${isActive ? '700' : '400'}; transition:all 0.3s;">
                ${cat.icon || ''} ${cat.name}
            </button>
        `;
    });
    
    html += `</div></div>`;
    categoriesDiv.innerHTML = html;
}

// ============================================
// FILTER BY CATEGORY
// ============================================
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    filterProducts();
    renderCategories();
}

// ============================================
// RENDER PRODUCTS
// ============================================
function renderProducts() {
    const productsDiv = document.getElementById('products-section');
    if (!productsDiv) return;
    
    let filteredProducts = products;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.categoryId === currentCategory);
    }
    
    // Filter by search
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
        
        html += `
            <div style="background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); transition:transform 0.3s, box-shadow 0.3s; cursor:pointer;" onclick="viewProduct('${product.id}')">
                <div style="position:relative; padding-bottom:100%; background:#f3f4f6;">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${product.name}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; transition:transform 0.3s;" loading="lazy">` : '<div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:40px;">📷</div>'}
                    ${discount > 0 ? `<div style="position:absolute; top:8px; right:8px; background:#EF4444; color:#fff; padding:2px 10px; border-radius:50px; font-size:12px; font-weight:700;">${discount}% OFF</div>` : ''}
                    ${!inStock ? `<div style="position:absolute; bottom:8px; left:8px; right:8px; background:rgba(0,0,0,0.7); color:#fff; text-align:center; padding:4px; border-radius:8px; font-size:12px;">Out of Stock</div>` : ''}
                </div>
                <div style="padding:12px;">
                    <h3 style="font-size:14px; font-weight:600; margin:0 0 4px; color:#1F2937; line-height:1.3;">${product.name}</h3>
                    <p style="font-size:12px; color:#6B7280; margin:0 0 8px;">${product.categoryName || 'Uncategorized'}</p>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:18px; font-weight:700; color:#000;">₦${Math.round(discountedPrice).toLocaleString()}</span>
                        ${discount > 0 ? `<span style="font-size:12px; color:#9CA3AF; text-decoration:line-through;">₦${product.price.toLocaleString()}</span>` : ''}
                    </div>
                    ${inStock ? `<button onclick="event.stopPropagation(); addToCart('${product.id}')" style="width:100%; margin-top:8px; background:#FFD700; border:none; padding:8px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer;">Add to Cart</button>` : ''}
                </div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    productsDiv.innerHTML = html;
}

// ============================================
// FILTER PRODUCTS (Combined)
// ============================================
function filterProducts() {
    renderProducts();
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
    alert('Product details coming soon! Product ID: ' + productId);
}

// ============================================
// ADD TO CART
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
    
    updateCartCount();
    alert('✅ Added to cart: ' + product.name);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'inline' : 'none';
    }
}

function toggleCart() {
    if (cart.length === 0) {
        alert('🛒 Your cart is empty. Start shopping!');
        return;
    }
    
    let message = '🛒 Your Cart:\n\n';
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `${item.name} x ${item.quantity} = ₦${subtotal.toLocaleString()}\n`;
    });
    message += `\nTotal: ₦${total.toLocaleString()}`;
    message += `\n\nDelivery: ₦${settings.deliveryFee || 500}`;
    message += `\nGrand Total: ₦${(total + (settings.deliveryFee || 500)).toLocaleString()}`;
    message += `\n\nCheckout coming soon!`;
    alert(message);
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
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.viewProduct = viewProduct;
window.filterProducts = filterProducts;

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

console.log('✅ Tadaa! Customer website ready!');
