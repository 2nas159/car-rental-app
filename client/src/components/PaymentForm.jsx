import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentFormComponent = ({ booking, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await api.post('/payments/create-payment-intent', {
          bookingId: booking._id,
          amount: booking.price
        });
        setClientSecret(response.clientSecret);
      } catch (error) {
        toast.error('Failed to initialize payment');
        console.error('Payment intent error:', error);
      }
    };

    if (booking) {
      createPaymentIntent();
    }
  }, [booking]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      return;
    }
    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      }
    });
    if (error) {
      toast.error(error.message || 'Payment failed');
      setLoading(false);
    } else {
      if (paymentIntent.status === 'succeeded') {
        try {
          // Confirm payment with backend
          await api.post('/payments/confirm-payment', {
            paymentIntentId: paymentIntent.id,
            bookingId: booking._id
          });
          toast.success('Payment successful!');
          onSuccess();
        } catch (error) {
          toast.error('Failed to confirm payment');
          console.error('Payment confirmation error:', error);
        }
      }
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        {/* Booking Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <img
              src={booking.car.image}
              alt={`${booking.car.brand} ${booking.car.model}`}
              className="w-12 h-12 rounded-lg object-cover mr-3"
            />
            <div>
              <h4 className="font-medium">{booking.car.brand} {booking.car.model}</h4>
              <p className="text-sm text-gray-600">
                {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-xl font-bold text-primary">${booking.price}</span>
          </div>
        </div>
        {/* Card Element */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-lg p-3">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay $${booking.price}`
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          Your payment is secure and encrypted
        </p>
      </div>
    </form>
  );
};

const PaymentForm = ({ booking, onSuccess, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormComponent 
        booking={booking} 
        onSuccess={onSuccess} 
        onCancel={onCancel} 
      />
    </Elements>
  );
};

export default PaymentForm; 