// ============================================
// FIREBASE CLOUD FUNCTIONS
// ============================================

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { handlePaystackWebhook } = require('./paystack-webhook');

admin.initializeApp();

// Export webhook handler
exports.paystackWebhook = functions.https.onRequest(handlePaystackWebhook);

// Health check endpoint
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
