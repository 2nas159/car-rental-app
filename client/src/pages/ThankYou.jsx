import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2 text-primary">Thank You!</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          Your booking and payment were successful.<br />
          We hope you enjoy your ride!
        </p>
        <button
          className="w-full py-3 mb-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dull transition-colors"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
        <button
          className="w-full py-3 bg-gray-100 text-primary rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          onClick={() => navigate("/my-bookings")}
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

export default ThankYou; 