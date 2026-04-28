import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  ChevronLeft,
  Plane,
  Info,
  Tag,
  Shield,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { paymentService, PaymentMethod } from "../services/paymentService";
import type { Booking } from "../services/bookingService";
import { bookingService } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

const PAYMENT_METHOD_ICONS: Record<string, string> = {
  UPI: "📱",
  CARD: "💳",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  UPI: "UPI Payment",
  CARD: "Credit / Debit Card",
};

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
  const [promoCode, setPromoCode] = useState("");
  const [addInsurance, setAddInsurance] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId) return;
      setLoading(true);
      try {
        const fetchedBooking = await bookingService.getBookingById(bookingId);
        setBooking(fetchedBooking);

        const fetchedMethods = await paymentService.getPaymentMethods();
        setPaymentMethods(fetchedMethods);
        if (fetchedMethods.length > 0) {
          setSelectedMethod(fetchedMethods[0]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load payment options.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  const baseFare = booking?.price || 199;
  const convenienceFee = 15;
  const taxes = 30;
  const insurancePrice = addInsurance ? 25 : 0;
  const totalAmount = baseFare + convenienceFee + taxes + insurancePrice;

  const handleProcessPayment = async () => {
    if (!booking || !selectedMethod) return;

    setProcessingPayment(true);
    setError(null);
    try {
      const amount = booking.price || 150; // Use actual booking price
      const payment = await paymentService.processPayment(
        booking.bookingId,
        selectedMethod,
        totalAmount
      );
      navigate(`/payment-success/${payment.paymentId}`);
    } catch (err: any) {
      setError(err.message || "Payment processing failed. Please try again.");
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

  if (error && !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-xl text-red-500 mb-4">{error}</p>
        <Link to="/my-bookings" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          View My Bookings
        </Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600 mb-4">Booking not found for payment.</p>
        <Link to="/my-bookings" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Complete Payment</h1>

          {/* Booking summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Booking Details</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {booking.flight && (
                <>
                  <p className="text-gray-500">Route:</p>
                  <p className="font-medium text-gray-800">{booking.flight.source} → {booking.flight.destination}</p>
                  <p className="text-gray-500">Departure:</p>
                  <p className="font-medium text-gray-800">{new Date(booking.flight.departureTime).toLocaleString()}</p>
                </>
              )}
              {booking.seat && (
                <>
                  <p className="text-gray-500">Seat:</p>
                  <p className="font-medium text-gray-800">{booking.seat.seatNumber} ({booking.seat.seatType})</p>
                </>
              )}
              <p className="text-gray-500">Status:</p>
              <p className="font-medium text-green-600">{booking.status}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Amount Due:</span>
                <span className="text-2xl font-bold text-green-600">${(booking.price || 150).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Payment Method</h2>
            {paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === method
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedMethod(method)}
                    disabled={processingPayment}
                  >
                    <span className="text-3xl">{PAYMENT_METHOD_ICONS[method] || "💰"}</span>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{PAYMENT_METHOD_LABELS[method] || method}</p>
                      <p className="text-sm text-gray-500">
                        {method === "UPI" ? "Pay via UPI ID or QR code" : "Visa, Mastercard, RuPay"}
                      </p>
                    </div>
                    {selectedMethod === method && (
                      <span className="ml-auto text-blue-600 text-xl">✓</span>
                    )}
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

          <div className="flex gap-4">
            <button
              onClick={handleProcessPayment}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors text-lg"
              disabled={!selectedMethod || processingPayment}
            >
              {processingPayment ? "Processing..." : `Pay $${(booking.price || 150).toFixed(2)}`}
            </button>

            <Link
              to={`/booking/${bookingId}`}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
