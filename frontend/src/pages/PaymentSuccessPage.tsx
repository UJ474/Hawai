import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { paymentService, Payment } from "../services/paymentService";
import { useAuth } from "../context/AuthContext";

const PaymentSuccessPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const { isAuthenticated } = useAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you might fetch payment details here
    // based on paymentId to confirm its status and display details.
    // For this prototype, we'll assume success if we land on this page.
    if (!isAuthenticated) {
      setError("Please log in to view payment details.");
      setLoading(false);
      return;
    }
    
    if (paymentId) {
        // Mocking a successful payment details fetch
        setPayment({
            paymentId: paymentId,
            bookingId: "mock-booking-id", // This should come from a real payment object
            amount: 100, // This should come from a real payment object
            status: "COMPLETED",
            method: "CARD", // This should come from a real payment object
        });
        setLoading(false);
    } else {
        setError("Payment ID is missing.");
        setLoading(false);
    }

  }, [paymentId, isAuthenticated]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading payment status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-500">{error}</p>
        <Link to="/my-bookings" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-700 mb-2">Your payment has been processed successfully.</p>
        {payment && (
          <>
            <p className="text-gray-600"><strong>Payment ID:</strong> {payment.paymentId}</p>
            <p className="text-gray-600"><strong>Booking ID:</strong> {payment.bookingId}</p>
            <p className="text-gray-600"><strong>Amount:</strong> ${payment.amount.toFixed(2)}</p>
            <p className="text-gray-600"><strong>Method:</strong> {payment.method}</p>
            <p className="text-gray-600 mb-6"><strong>Status:</strong> {payment.status}</p>
          </>
        )}
        <div className="flex justify-center gap-4">
          <Link
            to="/my-bookings"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            View My Bookings
          </Link>
          <Link
            to="/flights"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Book Another Flight
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
