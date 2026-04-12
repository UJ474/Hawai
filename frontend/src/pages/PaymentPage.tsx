import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { paymentService, PaymentMethod } from "../services/paymentService";
import { bookingService, Booking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

const PaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setError("Please log in to make a payment.");
        setLoading(false);
        return;
      }
      if (!bookingId) {
        setError("Booking ID is missing for payment.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedBooking = await bookingService.getBookingById(bookingId);
        setBooking(fetchedBooking);

        const fetchedMethods = await paymentService.getPaymentMethods();
        setPaymentMethods(fetchedMethods);
        if (fetchedMethods.length > 0) {
          setSelectedMethod(fetchedMethods[0]); // Select first method by default
        }
      } catch (err: any) {
        setError(err.message || "Failed to load payment page data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId, isAuthenticated]);

  const handleProcessPayment = async () => {
    if (!booking || !selectedMethod) {
      setError("Booking or payment method not selected.");
      return;
    }

    setProcessingPayment(true);
    setError(null);
    try {
      // Assuming the booking object contains the amount to be paid.
      // For simplicity, using a hardcoded amount if not present in booking.
      const amount = 100; // Replace with actual amount from booking if available
      const payment = await paymentService.processPayment(
        booking.bookingId,
        selectedMethod,
        amount
      );
      navigate(`/payment-success/${payment.paymentId}`); // Redirect to payment success page
    } catch (err: any) {
      setError(err.message || "Failed to process payment.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment</h1>
        <p className="text-lg text-gray-600">Please log in to make a payment.</p>
        <Link to="/login" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading payment options...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-500">{error}</p>
        <Link to={`/booking/${bookingId}`} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Booking
        </Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Booking not found for payment.</p>
        <Link to="/my-bookings" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Process Payment for Booking {booking.bookingId}</h1>

        <div className="mb-6">
          <p className="text-lg text-gray-700"><strong>Amount Due:</strong> $100.00 {/* Replace with actual booking amount */}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Select Payment Method</h2>
          {paymentMethods.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  className={`py-2 px-4 rounded-md text-sm font-medium border ${
                    selectedMethod === method
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300"
                  }`}
                  onClick={() => setSelectedMethod(method)}
                  disabled={processingPayment}
                >
                  {method.replace("_", " ")}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No payment methods available.</p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        <button
          onClick={handleProcessPayment}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          disabled={!selectedMethod || processingPayment}
        >
          {processingPayment ? "Processing..." : "Pay Now"}
        </button>

        <Link
          to={`/booking/${bookingId}`}
          className="ml-4 inline-block bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default PaymentPage;
