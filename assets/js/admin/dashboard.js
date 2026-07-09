// ============================================
// TADAA! - ADMIN DASHBOARD (FIXED)
// ============================================

// Import Firebase directly (not from config)
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { 
    getFirestore,
    collection, 
    getDocs, 
    getCountFromServer, 
    query, 
    where,
    orderBy,
    limit 
} from 'firebase/firestore';

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔥 Firebase initialized in dashboard');

// ===== DOM Elements =====
const pageContent = document.getElementById('pageContent');
const pageTitle = document.getElementById('pageTitle');
const adminEmailDisplay = document.getElementById('adminEmailDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// ===== Check Auth =====
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = '/tadaa-marketplace/admin.html';
        return;
    }
    if (adminEmailDisplay) {
        adminEmailDisplay.textContent = user.email;
    }
    loadDashboard();
});

// ===== Navigation =====
document.querySelectorAll('.admin-sidebar-nav a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        console.log('📄 Navigating to:', page);
        
        document.querySelectorAll('.admin-sidebar-nav a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        loadPage(page);
    });
});

// ===== Logout =====
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        import('./auth.js').then(module => {
            module.adminLogout();
        });
    });
}

// ===== Load Page =====
function loadPage(page) {
    pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);
    
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'inventory':
            loadInventory();
            break;
        case 'settings':
            loadSettings();
            break;
        default:
            loadDashboard();
    }
}

// ===== Dashboard Overview =====
async function loadDashboard() {
    pageContent.innerHTML = `
        <div class="stats-grid" id="statsGrid">
            <div class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-label">Total Products</div>
                <div class="stat-number" id="totalProducts">...</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📂</div>
                <div class="stat-label">Categories</div>
                <div class="stat-number" id="totalCategories">...</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📋</div>
                <div class="stat-label">Total Orders</div>
                <div class="stat-number" id="totalOrders">...</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-label">Total Sales</div>
                <div class="stat-number" id="totalSales">₦...</div>
            </div>
        </div>
        <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
            <h3 style="font-family: 'Cormorant Garamond', serif; margin-bottom: 12px;">📋 Recent Orders</h3>
            <div id="recentOrders">Loading...</div>
        </div>
    `;
    
    try {
        const productsSnapshot = await getCountFromServer(collection(db, 'products'));
        const categoriesSnapshot = await getCountFromServer(collection(db, 'categories'));
        const ordersSnapshot = await getCountFromServer(collection(db, 'orders'));
        
        document.getElementById('totalProducts').textContent = productsSnapshot.data().count;
        document.getElementById('totalCategories').textContent = categoriesSnapshot.data().count;
        document.getElementById('totalOrders').textContent = ordersSnapshot.data().count;
        
        const ordersQuery = query(collection(db, 'orders'), where('payment.status', '==', 'paid'));
        const ordersSnapshotPaid = await getDocs(ordersQuery);
        let totalSales = 0;
        ordersSnapshotPaid.forEach(doc => {
            const data = doc.data();
            if (data.totals && data.totals.grandTotal) {
                totalSales += data.totals.grandTotal;
            }
        });
        document.getElementById('totalSales').textContent = `₦${totalSales.toLocaleString()}`;
        
        const recentQuery = query(
            collection(db, 'orders'),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        const recentSnapshot = await getDocs(recentQuery);
        
        const recentOrdersDiv = document.getElementById('recentOrders');
        if (recentSnapshot.empty) {
            recentOrdersDiv.innerHTML = '<p style="color: #9CA3AF;">No orders yet.</p>';
        } else {
            let html = `<table class="admin-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>`;
            recentSnapshot.forEach(doc => {
                const data = doc.data();
                const statusColors = {
                    pending: '#F59E0B',
                    processing: '#3B82F6',
                    shipped: '#8B5CF6',
                    delivered: '#10B981',
                    cancelled: '#EF4444'
                };
                const statusColor = statusColors[data.status] || '#6B7280';
                html += `
                    <tr>
                        <td><strong>${data.orderId || 'N/A'}</strong></td>
                        <td>${data.customer?.fullName || 'Unknown'}</td>
                        <td>₦${data.totals?.grandTotal?.toLocaleString() || 0}</td>
                        <td><span style="background: ${statusColor}; color: white; padding: 2px 12px; border-radius: 50px; font-size: 12px; font-weight: 600;">${data.status || 'pending'}</span></td>
                    </tr>
                `;
            });
            html += `</tbody></table>`;
            recentOrdersDiv.innerHTML = html;
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        pageContent.innerHTML += `<p style="color: #EF4444;">Error loading data: ${error.message}</p>`;
    }
}

// ============================================
// CATEGORIES PAGE
// ============================================
function loadCategories() {
    pageContent.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                <h3 style="font-family: 'Cormorant Garamond', serif;">📂 Categories</h3>
                <button class="btn btn-primary btn-sm" onclick="window.showCategoryForm()">+ Add Category</button>
            </div>
            <div id="categoriesList">
                <p style="color: #9CA3AF;">Loading categories...</p>
            </div>
        </div>
    `;
    
    import('./categories.js').then(module => {
        module.loadCategories();
    }).catch(err => {
        console.error('Error loading categories module:', err);
        document.getElementById('categoriesList').innerHTML = `<p style="color: #EF4444;">Error loading categories: ${err.message}</p>`;
    });
}

// ============================================
// PRODUCTS PAGE
// ============================================
function loadProducts() {
    pageContent.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="font-family: 'Cormorant Garamond', serif;">📦 Products</h3>
                <button class="btn btn-primary btn-sm" id="addProductBtn">+ Add Product</button>
            </div>
            <div id="productsList">
                <p style="color: #9CA3AF;">Loading products...</p>
            </div>
        </div>
    `;
}

// ============================================
// ORDERS PAGE
// ============================================
function loadOrders() {
    pageContent.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
            <h3 style="font-family: 'Cormorant Garamond', serif; margin-bottom: 20px;">📋 Orders</h3>
            <div id="ordersList">
                <p style="color: #9CA3AF;">Loading orders...</p>
            </div>
        </div>
    `;
}

// ============================================
// INVENTORY PAGE
// ============================================
function loadInventory() {
    pageContent.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
            <h3 style="font-family: 'Cormorant Garamond', serif; margin-bottom: 20px;">📊 Inventory Management</h3>
            <div id="inventoryList">
                <p style="color: #9CA3AF;">Loading inventory...</p>
            </div>
        </div>
    `;
}

// ============================================
// SETTINGS PAGE
// ============================================
function loadSettings() {
    pageContent.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); max-width: 600px;">
            <h3 style="font-family: 'Cormorant Garamond', serif; margin-bottom: 20px;">⚙️ Store Settings</h3>
            <div id="settingsForm">
                <p style="color: #9CA3AF;">Loading settings...</p>
            </div>
        </div>
    `;
}

// ============================================
// GLOBAL FUNCTIONS
// ============================================
window.showCategoryForm = function(category = null) {
    import('./categories.js').then(module => {
        module.showCategoryForm(category);
    }).catch(err => {
        console.error('Error loading categories module:', err);
        alert('Error loading category form: ' + err.message);
    });
};

console.log('✅ Admin Dashboard loaded successfully!');
console.log('📄 Click "Categories" in the sidebar to test category management.');
