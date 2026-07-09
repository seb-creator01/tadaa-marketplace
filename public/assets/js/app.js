// ============================================
// TADAA! - MAIN APPLICATION ENTRY POINT
// ============================================

import { db, auth } from './config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

console.log('🛒 Tadaa! Marketplace Loaded');
console.log('🔥 Firebase connected successfully');

// ===== Global State =====
const state = {
    cart: [],
    currentPage: 'home',
    isAdmin: false,
    loading: false
};

// ===== DOM Elements =====
const mainContent = document.getElementById('main-content');
const mainHeader = document.getElementById('main-header');
const mainFooter = document.getElementById('main-footer');

// ===== Router =====
function navigateTo(page) {
    state.currentPage = page;
    renderPage(page);
}

// ===== Page Renderer =====
async function renderPage(page) {
    mainContent.innerHTML = `<h1>Loading ${page}...</h1>`;
    
    try {
        switch(page) {
            case 'home':
                await loadHomePage();
                break;
            case 'products':
                await loadProductsPage();
                break;
            case 'checkout':
                await loadCheckoutPage();
                break;
            case 'admin':
                await loadAdminPage();
                break;
            default:
                mainContent.innerHTML = `<h1>Page not found</h1>`;
        }
    } catch (error) {
        console.error('Error loading page:', error);
        mainContent.innerHTML = `<h1>Something went wrong</h1><p>${error.message}</p>`;
    }
}

// ===== Page Loaders (Placeholders) =====
async function loadHomePage() {
    mainContent.innerHTML = `
        <section class="section-divider">
            <div class="container">
                <h1 style="color: var(--color-yellow);">Welcome to Tadaa! 🎉</h1>
                <p style="font-size: 20px; color: var(--color-gray-600);">Your premium online marketplace</p>
                <p style="margin-top: 20px;">Loading products...</p>
                <div class="flex gap-4" style="margin-top: 30px; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="window.navigateTo('products')">Browse Products</button>
                    <button class="btn btn-secondary" onclick="window.navigateTo('admin')">Admin Dashboard</button>
                </div>
            </div>
        </section>
    `;
}

async function loadProductsPage() {
    mainContent.innerHTML = `
        <section class="section-divider">
            <div class="container">
                <h2>🛍️ Products</h2>
                <p>Product listing will appear here...</p>
            </div>
        </section>
    `;
}

async function loadCheckoutPage() {
    mainContent.innerHTML = `
        <section class="section-divider">
            <div class="container">
                <h2>🛒 Checkout</h2>
                <p>Checkout page will appear here...</p>
            </div>
        </section>
    `;
}

async function loadAdminPage() {
    mainContent.innerHTML = `
        <section class="section-divider">
            <div class="container">
                <h2>🔐 Admin Dashboard</h2>
                <p>Admin panel will appear here...</p>
            </div>
        </section>
    `;
}

// ===== Auth Listener =====
onAuthStateChanged(auth, (user) => {
    if (user) {
        state.isAdmin = true;
        console.log('✅ Admin logged in:', user.email);
    } else {
        state.isAdmin = false;
        console.log('👤 No user logged in');
    }
});

// ===== Make navigateTo global for onclick =====
window.navigateTo = navigateTo;

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    // Load home page by default
    navigateTo('home');
    
    // Simple header
    if (mainHeader) {
        mainHeader.innerHTML = `
            <nav style="background: var(--color-black); color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 24px; font-weight: bold; color: var(--color-yellow);">Tadaa!</span>
                </div>
                <div style="display: flex; gap: 16px;">
                    <button onclick="window.navigateTo('home')" style="background: none; border: none; color: white; cursor: pointer;">Home</button>
                    <button onclick="window.navigateTo('products')" style="background: none; border: none; color: white; cursor: pointer;">Shop</button>
                    <button onclick="window.navigateTo('admin')" style="background: none; border: none; color: var(--color-yellow); cursor: pointer;">Admin</button>
                </div>
            </nav>
        `;
    }
    
    if (mainFooter) {
        mainFooter.innerHTML = `
            <footer style="background: var(--color-black); color: var(--color-gray-400); padding: 24px; text-align: center; margin-top: 40px;">
                <p>© 2026 Tadaa! Marketplace. All rights reserved.</p>
            </footer>
        `;
    }
});

console.log('✅ Tadaa! App initialized successfully!');
