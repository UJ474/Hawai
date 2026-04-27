import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  Lock, 
  ChevronLeft,
  Plane,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { paymentService, PaymentMethod } from "../services/paymentService";
import type { Booking } from "../services/bookingService";
import { bookingService } from "../services/bookingService";
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

  const handleProcessPayment = async () => {
    if (!booking || !selectedMethod) return;

    setProcessingPayment(true);
    setError(null);
    try {
      const amount = booking.price || 244; 
      const payment = await paymentService.processPayment(
        booking.bookingId,
        selectedMethod,
        amount
      );
      navigate(`/payment-success/${payment.paymentId}`);
    } catch (err: any) {
      setError(err.message || "Payment processing failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-cloud flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <CreditCard className="w-12 h-12 text-tropical" />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cloud pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Left Side: Payment Options */}
          <div className="flex-1 space-y-8">
            <div>
              <Link to={`/booking/${bookingId}`} className="text-tropical font-bold flex items-center gap-2 mb-6 hover:gap-3 transition-all">
                <ChevronLeft className="w-5 h-5" /> Back to Booking
              </Link>
              <h1 className="text-4xl font-black text-ocean mb-2">Secure Checkout</h1>
              <p className="text-rock font-medium">Select your preferred payment method to finalize your trip.</p>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`
                    w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-300
                    ${selectedMethod === method 
                      ? "bg-white border-tropical shadow-2xl shadow-tropical/10 ring-4 ring-tropical/5" 
                      : "bg-white/50 border-sky/10 hover:border-sky/30 hover:bg-white"}
                  `}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${selectedMethod === method ? "bg-tropical text-white" : "bg-cloud text-tropical"}`}>
                      {method === 'UPI' ? <Smartphone className="w-7 h-7" /> : <CreditCard className="w-7 h-7" />}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-ocean uppercase tracking-tight">{method.replace("_", " ")}</p>
                      <p className="text-xs font-bold text-rock">Instant & Secured Payment</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method ? "border-tropical bg-tropical" : "border-sky/30"}`}>
                    {selectedMethod === method && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Security Notice */}
            <div className="bg-white p-8 rounded-[2rem] border border-sky/10 shadow-xl shadow-ocean/5">
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheck className="w-8 h-8 text-jungle" />
                <div>
                  <p className="font-black text-ocean">100% Encrypted Transactions</p>
                  <p className="text-xs font-bold text-rock">Your security is our top priority. We use bank-grade encryption.</p>
                </div>
              </div>
              <div className="flex gap-4 opacity-30 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-80 lg:shrink-0">
            <div className="bg-ocean rounded-[2.5rem] p-8 text-white shadow-2xl sticky top-32">
              <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4">Order Summary</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Plane className="w-5 h-5 text-sunset rotate-45" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-sky/60 uppercase tracking-widest">Flight Ref</p>
                    <p className="font-black text-sm uppercase">{booking?.flightId.split('-')[0]}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-sunset" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-sky/60 uppercase tracking-widest">Booking ID</p>
                    <p className="font-black text-sm uppercase">{booking?.bookingId.split('-')[0]}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-10 text-sm">
                <div className="flex justify-between font-bold">
                  <span className="text-sky/60">Subtotal</span>
                  <span>${booking?.price || 199}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-sky/60">Service Fee</span>
                  <span>$45</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between">
                  <span className="font-black text-lg">Total</span>
                  <span className="text-2xl font-black text-sunset">${(booking?.price || 199) + 45}</span>
                </div>
              </div>

              <button
                onClick={handleProcessPayment}
                disabled={processingPayment || !selectedMethod}
                className={`
                  w-full font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group
                  ${processingPayment ? "bg-white/10 cursor-not-allowed" : "bg-sunset hover:bg-coral text-white shadow-sunset/30"}
                `}
              >
                {processingPayment ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Smartphone className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    Pay Now
                    <ChevronLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-coral/20 rounded-xl flex items-start gap-3 border border-coral/30"
                >
                  <Info className="w-4 h-4 text-coral shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-coral leading-tight">{error}</p>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
