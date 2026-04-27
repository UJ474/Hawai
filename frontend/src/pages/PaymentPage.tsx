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
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Left Side: Payment Details */}
          <div className="flex-1 space-y-8">
            <div>
              <Link to={`/booking/${bookingId}`} className="text-tropical font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-6 hover:gap-4 transition-all group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Booking
              </Link>
              <h1 className="text-5xl font-black text-ocean mb-3 tracking-tighter">Secure Payment</h1>
              <p className="text-rock font-medium">Choose your payment method and secure your seat to paradise.</p>
            </div>

            {/* Travel Insurance Add-on */}
            <div className={`p-8 rounded-[3rem] border-2 transition-all cursor-pointer ${addInsurance ? "bg-jungle/5 border-jungle shadow-lg shadow-jungle/10" : "bg-white border-sky/10 hover:border-sky/30"}`} onClick={() => setAddInsurance(!addInsurance)}>
              <div className="flex items-start justify-between">
                <div className="flex gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${addInsurance ? "bg-jungle text-white" : "bg-cloud text-jungle"}`}>
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-ocean mb-1">Add Travel Insurance</h3>
                    <p className="text-xs font-medium text-rock leading-relaxed max-w-sm">Secure your trip against flight delays, cancellations, and medical emergencies for just $25.</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${addInsurance ? "bg-jungle border-jungle" : "border-sky/20"}`}>
                  {addInsurance && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-rock uppercase tracking-[0.3em] ml-4 mb-2">Select Payment Method</h3>
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`
                    w-full flex items-center justify-between p-8 rounded-[2.5rem] border-2 transition-all duration-300
                    ${selectedMethod === method 
                      ? "bg-white border-tropical shadow-2xl shadow-tropical/10 ring-8 ring-tropical/5" 
                      : "bg-white/50 border-sky/10 hover:border-sky/30 hover:bg-white"}
                  `}
                >
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${selectedMethod === method ? "bg-tropical text-white scale-110 shadow-lg shadow-tropical/20" : "bg-cloud text-tropical"}`}>
                      {method === 'UPI' ? <Smartphone className="w-8 h-8" /> : <CreditCard className="w-8 h-8" />}
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-black text-ocean uppercase tracking-tight">{method.replace("_", " ")}</p>
                      <p className="text-xs font-bold text-rock mt-1">Faster & 100% Secured</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method ? "border-tropical bg-tropical" : "border-sky/30"}`}>
                    {selectedMethod === method && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Promo Code */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-sky/10">
              <h3 className="text-xs font-black text-ocean uppercase tracking-widest mb-6 flex items-center gap-2">
                <Tag className="w-4 h-4 text-tropical" /> Have a Promo Code?
              </h3>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Enter code (e.g. HAWAI50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-cloud border-none rounded-2xl px-6 font-bold text-ocean placeholder:text-rock/30 focus:ring-2 focus:ring-tropical/20"
                />
                <button className="bg-ocean text-white font-black px-10 rounded-2xl hover:bg-tropical transition-all uppercase tracking-widest text-xs">Apply</button>
              </div>
            </div>
          </div>

          {/* Right Side: Detailed Bill */}
          <div className="lg:w-[400px]">
            <div className="bg-ocean rounded-[3.5rem] p-10 text-white shadow-2xl sticky top-32">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
                <h3 className="text-2xl font-black">Fare Summary</h3>
                <HelpCircle className="w-5 h-5 opacity-30 hover:opacity-100 cursor-pointer transition-opacity" />
              </div>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-sky/60 font-bold">Base Fare ({booking?.seatId})</span>
                  <span className="font-black text-lg">${baseFare}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-sky/60 font-bold">Fuel Surcharge</span>
                  <span className="font-black text-lg">$0</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-sky/60 font-bold">Airport User Fee</span>
                  <span className="font-black text-lg">$10</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-sky/60 font-bold">Passenger Service Fee</span>
                  <span className="font-black text-lg">$20</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-sky/60 font-bold">Convenience Fee</span>
                  <span className="font-black text-lg">${convenienceFee}</span>
                </div>
                {addInsurance && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-center text-sm text-sunset">
                    <span className="font-bold">Travel Insurance</span>
                    <span className="font-black text-lg">$25</span>
                  </motion.div>
                )}
              </div>

              <div className="pt-8 border-t-2 border-dashed border-white/10 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-sky/40 uppercase tracking-widest mb-1">Total Payable</p>
                    <p className="text-5xl font-black text-sunset tracking-tighter">${totalAmount}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-sky/40" />
                  </div>
                </div>

                <button
                  onClick={handleProcessPayment}
                  disabled={processingPayment || !selectedMethod}
                  className={`
                    w-full py-5 rounded-3xl font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-4 group
                    ${processingPayment ? "bg-white/10 cursor-wait" : "bg-white text-ocean hover:bg-sunset hover:text-white shadow-white/5"}
                  `}
                >
                  {processingPayment ? "Processing..." : "Complete Payment"}
                  {!processingPayment && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                </button>
              </div>

              {/* Security Badges */}
              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                <div className="flex items-center gap-3 text-sky/40">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Compliant</span>
                </div>
                <div className="flex gap-6 grayscale opacity-20 hover:opacity-50 transition-opacity">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
