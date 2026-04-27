import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  CheckCircle2, 
  PartyPopper, 
  Ticket, 
  Calendar, 
  MapPin, 
  Plane,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import type { Payment } from "../services/paymentService";
import { useAuth } from "../context/AuthContext";

const PaymentSuccessPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const { isAuthenticated } = useAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    if (paymentId) {
        setPayment({
            paymentId: paymentId,
            bookingId: "B-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            amount: 244,
            status: "COMPLETED",
            method: "CARD" as Payment["method"],
        });
        setLoading(false);
    } else {
        setError("Payment ID is missing.");
        setLoading(false);
    }
  }, [paymentId, isAuthenticated]);

  if (loading) return (
    <div className="min-h-screen bg-cloud flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
        <CheckCircle2 className="w-16 h-16 text-jungle opacity-20" />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center p-6 pt-32 pb-20">
      <div className="max-w-xl w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-sky/10"
        >
          {/* Success Banner */}
          <div className="bg-jungle p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                <PartyPopper className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">Payment Confirmed!</h1>
              <p className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Your ticket is being prepared</p>
            </motion.div>
          </div>

          <div className="p-10 space-y-8">
            {/* Transaction Info */}
            <div className="grid grid-cols-2 gap-8 border-b border-sky/10 pb-8">
              <div>
                <p className="text-[10px] font-black text-rock uppercase tracking-widest mb-1">Receipt No</p>
                <p className="font-black text-ocean">{paymentId?.split('-')[0].toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-rock uppercase tracking-widest mb-1">Amount Paid</p>
                <p className="font-black text-ocean text-xl">${payment?.amount}</p>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-cloud rounded-[2rem] p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md shrink-0">
                  <Ticket className="w-5 h-5 text-tropical" />
                </div>
                <div>
                  <p className="font-black text-ocean text-sm">Boarding Pass Ready</p>
                  <p className="text-xs font-medium text-rock">We've sent your digital ticket to your registered email address.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <Link
                to="/my-bookings"
                className="w-full bg-ocean hover:bg-tropical text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-ocean/20 flex items-center justify-center gap-3 group"
              >
                Go to My Bookings
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/"
                className="w-full bg-cloud hover:bg-sky text-ocean font-black py-4 rounded-2xl transition-all text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
        
        <p className="text-center mt-8 text-rock font-bold text-xs">
          Need help? <Link to="/support" className="text-tropical underline">Contact our 24/7 support team</Link>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
