const express = require('express');
const stripe = require('../config/stripe');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: bookingId,
        userId: req.user
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment and update booking
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Update booking status
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        status: 'confirmed',
        paymentIntentId: paymentIntentId,
        paidAt: new Date()
      },
      { new: true }
    ).populate('car owner');

    res.json({ 
      success: true, 
      booking,
      message: 'Payment confirmed and booking updated'
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Get payment status
router.get('/payment-status/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    let paymentStatus = 'pending';
    if (booking.paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(booking.paymentIntentId);
      paymentStatus = paymentIntent.status;
    }

    res.json({ paymentStatus, booking });
  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

// Stripe webhook (for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update booking status if needed
      if (paymentIntent.metadata.bookingId) {
        await Booking.findByIdAndUpdate(
          paymentIntent.metadata.bookingId,
          { 
            status: 'confirmed',
            paidAt: new Date()
          }
        );
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router; 