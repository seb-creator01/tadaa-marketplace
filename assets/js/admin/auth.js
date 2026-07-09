// ============================================
// TADAA! - ADMIN AUTHENTICATION
// ============================================

// Import Firebase from the config file
import { auth } from '../config/firebase.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// ===== DOM Elements =====
const loginForm = document.getElementById('adminLoginForm');
const emailInput = document.getElementById('adminEmail');
const passwordInput = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

// ===== Check if we're on the login page =====
if (loginForm) {
    console.log('✅ Login form found');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('📝 Login form submitted');
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }
        
        console.log('📧 Attempting login for:', email);
        
        // Show loading state
        loginBtn.textContent = 'Signing in...';
        loginBtn.disabled = true;
        hideError();
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('✅ Admin logged in successfully:', user.email);
            console.log('🆔 User UID:', user.uid);
            
            // Redirect to dashboard
            window.location.href = '/tadaa-marketplace/dashboard.html';
            
        } catch (error) {
            console.error('❌ Login error:', error.code, error.message);
            
            let errorMessage = 'Invalid email or password. Please try again.';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email format. Please check your email.';
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
        console.log('⚠️ Error shown:', message);
    }
}

function hideError() {
    if (loginError) {
        loginError.classList.remove('visible');
    }
}

// ===== Check Auth State =====
onAuthStateChanged(auth, (user) => {
    console.log('🔐 Auth state changed:', user ? user.email : 'No user');
    
    if (user) {
        console.log('✅ Admin already logged in:', user.email);
        // If on login page and already logged in, redirect to dashboard
        if (window.location.pathname.includes('admin.html')) {
            console.log('🔄 Redirecting to dashboard...');
            window.location.href = '/tadaa-marketplace/dashboard.html';
        }
    } else {
        console.log('👤 No user logged in');
        // If on dashboard page and not logged in, redirect to login
        if (window.location.pathname.includes('dashboard.html')) {
            console.log('🔄 Redirecting to login...');
            window.location.href = '/tadaa-marketplace/admin.html';
        }
    }
});

// ===== Admin Logout =====
export function adminLogout() {
    console.log('🚪 Logging out...');
    signOut(auth).then(() => {
        console.log('✅ Admin logged out');
        window.location.href = '/tadaa-marketplace/admin.html';
    }).catch((error) => {
        console.error('❌ Logout error:', error);
        alert('Error logging out. Please try again.');
    });
}

console.log('✅ Admin auth module loaded successfully!');
