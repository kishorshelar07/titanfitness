const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Membership } = require('../models/index');
const {
  sendEmail,
  membershipWelcomeEmail,
} = require('../utils/emailService');

// ── Razorpay Instance ─────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Create Order ──────────────────────────────────────────────────
// POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, plan, billingCycle } = req.body;

    const options = {
      amount:   Math.round(amount * 100), // Razorpay paise madhe gheto
      currency: 'INR',
      receipt:  `titan_${Date.now()}`,
      notes: {
        plan,
        billingCycle,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Verify Payment ────────────────────────────────────────────────
// POST /api/payment/verify
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      memberName,
      email,
      phone,
      plan,
      billingCycle,
      amount,
    } = req.body;

    // Signature verify करा
    const body      = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed!' });
    }

    // Payment verified — membership save करा
    const membership = await Membership.create({
      memberName,
      email,
      phone,
      plan,
      billingCycle,
      amount,
      status:            'active',
      paymentId:         razorpay_payment_id,
      orderId:           razorpay_order_id,
    });

    // Welcome email पाठवा
    if (email) {
      await sendEmail(membershipWelcomeEmail({ memberName, email, phone, plan, billingCycle, amount }));
    }

    res.json({
      success: true,
      message: 'Payment successful! Welcome to Titan Fitness Club!',
      data:    membership,
    });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
