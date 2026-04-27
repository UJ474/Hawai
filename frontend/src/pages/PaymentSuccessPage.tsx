import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PaymentSuccessPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Status</h1>
        <p className="text-lg text-gray-600">Please log in to view payment details.</p>
        <Link to="/login" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-lg">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-700 mb-2">Your payment has been processed successfully.</p>

          {paymentId && (
            <p className="text-gray-500 text-sm mb-6">Payment ID: {paymentId}</p>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 font-medium">✓ Your booking is now confirmed and paid</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/my-bookings"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              View My Bookings
            </Link>
            <Link
              to="/flights"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Book Another Flight
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
