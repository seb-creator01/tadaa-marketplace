// ============================================
// TADAA! - ADMIN AUTHENTICATION
// ============================================

import { auth } from '../config/firebase.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// ===== DOM Elements =====
const loginForm = document.getElementById('adminLoginForm');
const emailInput = document.getElementById('adminEmail');
const passwordInput = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

// ===== Admin Login =====
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }
        
        // Show loading state
        loginBtn.textContent = 'Signing in...';
        loginBtn.disabled = true;
        hideError();
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('✅ Admin logged in:', user.email);
            
            // Redirect to dashboard
            window.location.href = '/tadaa-marketplace/dashboard.html';
            
        } catch (error) {
            console.error('❌ Login error:', error);
            
            let errorMessage = 'Invalid email or password. Please try again.';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            }
            
            showError(errorMessage);
            loginBtn.textContent = 'Sign In';
            loginBtn.disabled = false;
        }
    });
}

// ===== Show/Hide Error =====
function showError(message) {
    if (loginError) {
        loginError.textContent = message;
        loginError.classList.add('visible');
    }
}

function hideError() {
    if (loginError) {
        loginError.classList.remove('visible');
    }
}

// ===== Check Auth State =====
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('✅ Admin already logged in:', user.email);
        // If on login page and already logged in, redirect to dashboard
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = '/tadaa-marketplace/dashboard.html';
        }
    } else {
        console.log('👤 No user logged in');
        // If on dashboard page and not logged in, redirect to login
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = '/tadaa-marketplace/admin.html';
        }
    }
});

// ===== Admin Logout =====
export function adminLogout() {
    signOut(auth).then(() => {
        console.log('✅ Admin logged out');
        window.location.href = '/tadaa-marketplace/admin.html';
    }).catch((error) => {
        console.error('❌ Logout error:', error);
        alert('Error logging out. Please try again.');
    });
}
