// ============================================
// TADAA! - CHECKOUT PAGE
// Premium Guest Checkout
// ============================================

// ============================================
// GENERATE ORDER ID
// ============================================
function generateOrderId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    let counter = parseInt(localStorage.getItem('tadaa_order_counter') || '0') + 1;
    localStorage.setItem('tadaa_order_counter', counter.toString());
    
    const orderNumber = String(counter).padStart(6, '0');
    return `TAD-${year}${month}${day}-${orderNumber}`;
}

// ============================================
// LOAD CHECKOUT PAGE
// ============================================
function loadCheckoutPage() {
    // Get cart from localStorage
    let cart = [];
    try {
        const saved = localStorage.getItem('tadaa_cart');
        if (saved) {
            cart = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading cart:', e);
    }
    
    if (cart.length === 0) {
        window.location.href = '/tadaa-marketplace/';
        return;
    }
    
    // Get settings from window
    const settings = window.tadaaSettings || {};
    const deliveryFee = settings.deliveryFee || 500;
    const freeThreshold = settings.freeDeliveryThreshold || 5000;
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isFreeDelivery = freeThreshold > 0 && subtotal >= freeThreshold;
    const deliveryCharge = isFreeDelivery ? 0 : deliveryFee;
    const total = subtotal + deliveryCharge;
    
    // Build the checkout page
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    mainContent.innerHTML = `
        <div style="max-width:900px; margin:0 auto; padding:20px;">
            <h1 style="font-family:'Cormorant Garamond', serif; font-size:32px; color:#1F2937; margin-bottom:8px;">🛒 Checkout</h1>
            <p style="color:#6B7280; margin-bottom:24px;">Enter your details to complete your order</p>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
                <!-- Left: Form -->
                <div style="grid-column: 1 / 2;">
                    <form id="checkoutForm" style="background:#fff; border-radius:16px; padding:24px; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
                        <h3 style="font-family:'Cormorant Garamond', serif; font-size:20px; margin:0 0 16px;">📋 Your Details</h3>
                        
                        <div class="form-group" style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:4px;">Full Name *</label>
                            <input type="text" id="fullName" placeholder="e.g., John Doe" required style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:10px; font-size:16px; transition:border-color 0.3s;" onfocus="this.style.borderColor='#FFD700'" onblur="this.style.borderColor='#E5E7EB'">
                        </div>
                        
                        <div class="form-group" style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:4px;">Phone Number *</label>
                            <input type="tel" id="phoneNumber" placeholder="e.g., 08012345678" required style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:10px; font-size:16px; transition:border-color 0.3s;" onfocus="this.style.borderColor='#FFD700'" onblur="this.style.borderColor='#E5E7EB'">
                        </div>
                        
                        <div class="form-group" style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:4px;">Email Address</label>
                            <input type="email" id="emailAddress" placeholder="e.g., john@example.com" style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:10px; font-size:16px; transition:border-color 0.3s;" onfocus="this.style.borderColor='#FFD700'" onblur="this.style.borderColor='#E5E7EB'">
                            <small style="color:#6B7280;">We'll send your order confirmation here (optional)</small>
                        </div>
                        
                        <div class="form-group" style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:4px;">Delivery Address *</label>
                            <textarea id="deliveryAddress" placeholder="e.g., 12, Awolowo Road, Ikoyi, Lagos" required style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:10px; font-size:16px; min-height:80px; resize:vertical; transition:border-color 0.3s;" onfocus="this.style.borderColor='#FFD700'" onblur="this.style.borderColor='#E5E7EB'"></textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:4px;">Delivery Instructions</label>
                            <input type="text" id="deliveryInstructions" placeholder="e.g., Call before arrival, Gate code: 1234" style="width:100%; padding:12px; border:2px solid #E5E7EB; border-radius:10px; font-size:16px; transition:border-color 0.3s;" onfocus="this.style.borderColor='#FFD700'" onblur="this.style.borderColor='#E5E7EB'">
                        </div>
                        
                        <div id="formError" style="background:#FEE2E2; color:#DC2626; padding:12px; border-radius:10px; display:none; margin-bottom:16px;"></div>
                        
                        <button type="submit" style="width:100%; background:#FFD700; color:#000; border:none; padding:16px; border-radius:12px; font-size:18px; font-weight:700; cursor:pointer; transition:background 0.3s;" onmouseover="this.style.background='#E6C200'" onmouseout="this.style.background='#FFD700'">
                            🛒 Place Order - ₦${total.toLocaleString()}
                        </button>
                    </form>
                </div>
                
                <!-- Right: Order Summary -->
                <div style="grid-column: 2 / 3;">
                    <div style="background:#fff; border-radius:16px; padding:24px; box-shadow:0 2px 12px rgba(0,0,0,0.08); position:sticky; top:20px;">
                        <h3 style="font-family:'Cormorant Garamond', serif; font-size:20px; margin:0 0 16px;">📦 Order Summary</h3>
                        
                        <div id="orderItems" style="max-height:300px; overflow-y:auto; margin-bottom:16px; border-bottom:1px solid #E5E7EB;">
                            ${cart.map(item => `
                                <div style="display:flex; gap:12px; padding:8px 0; border-bottom:1px solid #F3F4F6;">
                                    <div style="width:50px; height:50px; border-radius:8px; overflow:hidden; background:#F3F4F6; flex-shrink:0;">
                                        ${item.images && item.images.length > 0 ? `<img src="${item.images[0]}" style="width:100%; height:100%; object-fit:cover;">` : '📷'}
                                    </div>
                                    <div style="flex:1; min-width:0;">
                                        <p style="margin:0; font-weight:600; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</p>
                                        <p style="margin:0; font-size:12px; color:#6B7280;">Qty: ${item.quantity} × ₦${item.price.toLocaleString()}</p>
                                    </div>
                                    <div style="font-weight:600; font-size:14px;">₦${(item.price * item.quantity).toLocaleString()}</div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div style="margin-bottom:12px;">
                            <div style="display:flex; justify-content:space-between; padding:4px 0;">
                                <span style="color:#6B7280;">Subtotal</span>
                                <span style="font-weight:600;">₦${subtotal.toLocaleString()}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; padding:4px 0;">
                                <span style="color:#6B7280;">Delivery</span>
                                <span style="font-weight:600; color:${isFreeDelivery ? '#10B981' : '#1F2937'};">${isFreeDelivery ? '🎉 FREE' : `₦${deliveryFee.toLocaleString()}`}</span>
                            </div>
                            ${isFreeDelivery ? `<div style="background:#D1FAE5; color:#065F46; padding:8px 12px; border-radius:8px; margin:8px 0; text-align:center; font-size:13px; font-weight:600;">🎉 You qualify for FREE delivery!</div>` : ''}
                            ${!isFreeDelivery && freeThreshold - subtotal > 0 ? `<div style="background:#FEF3C7; color:#92400E; padding:8px 12px; border-radius:8px; margin:8px 0; text-align:center; font-size:13px;">Add ₦${(freeThreshold - subtotal).toLocaleString()} more for FREE delivery</div>` : ''}
                            <div style="display:flex; justify-content:space-between; border-top:2px solid #E5E7EB; padding-top:12px; margin-top:8px; font-size:20px; font-weight:700;">
                                <span>Total</span>
                                <span style="color:#FFD700;">₦${total.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div style="background:#F9FAFB; border-radius:8px; padding:12px; font-size:13px; color:#6B7280;">
                            <p style="margin:0;">🔒 Secure checkout. Your information is safe.</p>
                            <p style="margin:4px 0 0;">📝 Order ID will be generated after payment</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity:0; transform:translateY(20px); }
            to { opacity:1; transform:translateY(0); }
        }
        #checkoutForm, #orderSummary {
            animation: fadeInUp 0.5s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Handle form submission
    document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await placeOrder(cart, settings);
    });
}

// ============================================
// PLACE ORDER
// ============================================
async function placeOrder(cart, settings) {
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const emailAddress = document.getElementById('emailAddress').value.trim();
    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
    const deliveryInstructions = document.getElementById('deliveryInstructions').value.trim();
    
    // Validate
    const errorDiv = document.getElementById('formError');
    if (!fullName) {
        errorDiv.textContent = '❌ Please enter your full name';
        errorDiv.style.display = 'block';
        return;
    }
    if (!phoneNumber) {
        errorDiv.textContent = '❌ Please enter your phone number';
        errorDiv.style.display = 'block';
        return;
    }
    if (!deliveryAddress) {
        errorDiv.textContent = '❌ Please enter your delivery address';
        errorDiv.style.display = 'block';
        return;
    }
    errorDiv.style.display = 'none';
    
    // Calculate totals
    const deliveryFee = settings.deliveryFee || 500;
    const freeThreshold = settings.freeDeliveryThreshold || 5000;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isFreeDelivery = freeThreshold > 0 && subtotal >= freeThreshold;
    const deliveryCharge = isFreeDelivery ? 0 : deliveryFee;
    const total = subtotal + deliveryCharge;
    
    // Generate Order ID
    const orderId = generateOrderId();
    
    // Build order data
    const orderData = {
        orderId: orderId,
        customer: {
            fullName: fullName,
            phoneNumber: phoneNumber,
            emailAddress: emailAddress || '',
            deliveryAddress: deliveryAddress,
            deliveryInstructions: deliveryInstructions || ''
        },
        items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images && item.images.length > 0 ? item.images[0] : '',
            total: item.price * item.quantity
        })),
        totals: {
            subtotal: subtotal,
            deliveryFee: deliveryCharge,
            discountAmount: 0,
            grandTotal: total
        },
        delivery: {
            fee: deliveryCharge,
            isFree: isFreeDelivery,
            threshold: freeThreshold
        },
        payment: {
            status: 'pending',
            method: 'moniepoint',
            transactionRef: '',
            amountPaid: 0,
            paidAt: null
        },
        status: 'pending',
        notifications: {
            paymentReceived: false,
            processing: false,
            shipped: false,
            delivered: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    try {
        // Get Firestore reference from window
        const db = window.tadaaDb || firebase.firestore();
        
        // Save to Firestore
        const docRef = await db.collection('orders').add(orderData);
        console.log('✅ Order saved! ID:', docRef.id, 'Order ID:', orderId);
        
        // Save the Firestore doc ID to the order
        await db.collection('orders').doc(docRef.id).update({
            firestoreId: docRef.id
        });
        
        // Clear cart
        localStorage.removeItem('tadaa_cart');
        localStorage.removeItem('tadaa_order_counter');
        
        // Show success
        showOrderSuccess(docRef.id, orderId, orderData);
        
    } catch (error) {
        console.error('❌ Error placing order:', error);
        errorDiv.textContent = '❌ Error placing order: ' + error.message;
        errorDiv.style.display = 'block';
    }
}

// ============================================
// SHOW ORDER SUCCESS
// ============================================
function showOrderSuccess(docId, orderId, orderData) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    mainContent.innerHTML = `
        <div style="max-width:600px; margin:40px auto; padding:20px; text-align:center;">
            <div style="background:#D1FAE5; color:#065F46; padding:60px 40px; border-radius:24px; box-shadow:0 8px 32px rgba(0,0,0,0.1); animation:fadeInUp 0.6s ease;">
                <p style="font-size:64px; margin:0 0 16px;">🎉</p>
                <h1 style="font-family:'Cormorant Garamond', serif; font-size:32px; color:#065F46; margin:0 0 8px;">Order Placed Successfully!</h1>
                <p style="color:#065F46; font-size:18px; margin:0 0 8px;">Thank you for your order!</p>
                <div style="background:#fff; border-radius:12px; padding:20px; margin:20px 0;">
                    <p style="color:#6B7280; margin:0; font-size:14px;">Order ID</p>
                    <p style="font-size:28px; font-weight:700; color:#000; margin:4px 0 0; letter-spacing:1px;">${orderId}</p>
                </div>
                <div style="text-align:left; background:#fff; border-radius:12px; padding:16px; margin:16px 0; font-size:14px;">
                    <p style="margin:4px 0;"><strong>Customer:</strong> ${orderData.customer.fullName}</p>
                    <p style="margin:4px 0;"><strong>Phone:</strong> ${orderData.customer.phoneNumber}</p>
                    <p style="margin:4px 0;"><strong>Address:</strong> ${orderData.customer.deliveryAddress}</p>
                    <p style="margin:8px 0 0; border-top:1px solid #E5E7EB; padding-top:8px;"><strong>Total:</strong> ₦${orderData.totals.grandTotal.toLocaleString()}</p>
                    <p style="margin:4px 0 0;"><strong>Payment:</strong> Pending</p>
                </div>
                <div style="background:#FEF3C7; color:#92400E; padding:12px; border-radius:8px; font-size:14px; margin:12px 0;">
                    ⏳ Your order is pending payment. We'll send you a confirmation once payment is confirmed.
                </div>
                <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:20px;">
                    <button onclick="window.location.href='/tadaa-marketplace/'" style="background:#FFD700; color:#000; border:none; padding:12px 24px; border-radius:50px; font-size:16px; font-weight:600; cursor:pointer;">🛍️ Continue Shopping</button>
                    <button onclick="window.location.reload()" style="background:#f3f4f6; color:#1F2937; border:none; padding:12px 24px; border-radius:50px; font-size:16px; font-weight:600; cursor:pointer;">🔄 Refresh</button>
                </div>
            </div>
        </div>
    `;
}

// Make functions available globally
window.loadCheckoutPage = loadCheckoutPage;

console.log('✅ Checkout module loaded!');
