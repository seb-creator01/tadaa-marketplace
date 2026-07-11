// ============================================
// PAYSTACK WEBHOOK HANDLER
// ============================================

const admin = require('firebase-admin');
const crypto = require('crypto');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * Verify Paystack webhook signature
 */
function verifyWebhookSignature(signature, payload, secretKey) {
    try {
        const hash = crypto
            .createHmac('sha512', secretKey)
            .update(JSON.stringify(payload))
            .digest('hex');
        return hash === signature;
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

exports.handlePaystackWebhook = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const payload = req.body;
        const signature = req.headers['x-paystack-signature'];

        console.log('📩 Webhook received:', {
            event: payload.event,
            reference: payload.data?.reference
        });

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        const isValid = verifyWebhookSignature(signature, payload, secretKey);

        if (!isValid) {
            console.error('❌ Invalid webhook signature');
            return res.status(400).json({
                code: 'SIGNATURE_INVALID',
                message: 'Invalid signature'
            });
        }

        const event = payload.event;
        const data = payload.data;
        const reference = data.reference;
        const amount = data.amount / 100;
        const transactionId = data.id;

        const ordersRef = db.collection('orders');
        const orderQuery = await ordersRef.where('orderId', '==', reference).get();

        if (orderQuery.empty) {
            console.error('❌ Order not found:', reference);
            return res.status(404).json({
                code: 'ORDER_NOT_FOUND',
                message: 'Order not found'
            });
        }

        let orderDoc = null;
        let orderData = null;
        orderQuery.forEach(doc => {
            orderDoc = doc;
            orderData = doc.data();
        });

        const expectedAmount = orderData.totals.grandTotal;
        if (amount !== expectedAmount) {
            console.error('❌ Amount mismatch:', {
                expected: expectedAmount,
                received: amount
            });
            return res.status(400).json({
                code: 'AMOUNT_MISMATCH',
                message: 'Payment amount does not match order total'
            });
        }

        if (orderData.payment.status === 'paid') {
            console.log('✅ Payment already processed for:', reference);
            return res.status(200).json({
                code: '00000',
                message: 'Payment already processed'
            });
        }

        if (event === 'charge.success') {
            await orderDoc.ref.update({
                'payment.status': 'paid',
                'payment.method': 'paystack',
                'payment.transactionRef': transactionId.toString(),
                'payment.reference': reference,
                'payment.amountPaid': amount,
                'payment.paidAt': new Date().toISOString(),
                status: 'pending',
                updatedAt: new Date().toISOString()
            });

            console.log('✅ Order paid successfully:', {
                orderId: reference,
                transactionId: transactionId
            });

            return res.status(200).json({
                code: '00000',
                message: 'SUCCESSFUL'
            });

        } else if (event === 'charge.failed') {
            await orderDoc.ref.update({
                'payment.status': 'failed',
                'payment.failureReason': data.gateway_response || 'Payment declined',
                updatedAt: new Date().toISOString()
            });

            console.log('❌ Payment failed:', reference);
            return res.status(200).json({
                code: '00000',
                message: 'Payment failed recorded'
            });

        } else {
            await orderDoc.ref.update({
                'payment.status': 'pending',
                updatedAt: new Date().toISOString()
            });

            console.log('⏳ Payment status updated:', event);
            return res.status(200).json({
                code: '00000',
                message: 'Status updated'
            });
        }

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return res.status(500).json({
            code: 'INTERNAL_ERROR',
            message: error.message
        });
    }
};
