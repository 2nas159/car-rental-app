import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import PaymentForm from "./PaymentForm";

const BookingConfirmationModal = ({
  isOpen,
  onClose,
  booking,
  onConfirm,
  loading,
}) => {
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen || !booking) return null;

  const currency = import.meta.env.VITE_CURRENCY || "$";
  const days = Math.ceil(
    (new Date(booking.returnDate) - new Date(booking.pickupDate)) /
      (1000 * 60 * 60 * 24)
  );

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    onConfirm();
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Confirm Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <img src={assets.close_icon} alt="Close" className="w-5 h-5" />
            </button>
          </div>

          {/* Car Details */}
          <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <img
              src={booking.car.image}
              alt={`${booking.car.brand} ${booking.car.model}`}
              className="w-16 h-16 rounded-lg object-cover mr-3"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {booking.car.brand} {booking.car.model}
              </h3>
              <p className="text-sm text-gray-600">
                {booking.car.category} • {booking.car.year}
              </p>
              <p className="text-sm text-gray-600">{booking.car.location}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pickup Date:</span>
              <span className="font-medium">
                {new Date(booking.pickupDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Return Date:</span>
              <span className="font-medium">
                {new Date(booking.returnDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{days} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price per day:</span>
              <span className="font-medium">
                {currency}
                {booking.car.pricePerDay}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center text-lg font-bold text-primary">
              <span>Total Price:</span>
              <span>
                {currency}
                {booking.price}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowPayment(true)}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment powered by Stripe
          </p>
        </motion.div>
      </motion.div>

      {/* Payment Modal */}
      {showPayment && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handlePaymentCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Payment</h2>
                <button
                  onClick={handlePaymentCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <img
                    src={assets.close_icon}
                    alt="Close"
                    className="w-5 h-5"
                  />
                </button>
              </div>

              <PaymentForm
                booking={booking}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </AnimatePresence>
  );
};

export default BookingConfirmationModal;
