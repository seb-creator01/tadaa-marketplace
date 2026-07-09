// ============================================
// FIREBASE CONFIGURATION
// Tadaa! Marketplace
// ============================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// ===== YOUR FIREBASE CONFIG =====
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

// ===== Export Services =====
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log('🔥 Firebase initialized successfully!');
console.log('📁 Project:', firebaseConfig.projectId);
