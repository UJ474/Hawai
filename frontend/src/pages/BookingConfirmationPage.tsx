import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Plane, 
  MapPin, 
  Calendar, 
  User, 
  Armchair, 
  CreditCard,
  Download,
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { bookingService } from "../services/bookingService";
import type { Booking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const fetchedBooking = await bookingService.getBookingById(id);
        setBooking(fetchedBooking);
      } catch (err: any) {
        setError(err.message || "Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-cloud flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <Plane className="w-12 h-12 text-tropical" />
      </motion.div>
    </div>
  );

  if (error || !booking) return (
    <div className="min-h-screen bg-cloud flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl text-center max-w-md border border-sky/10">
        <p className="text-xl font-bold text-ocean mb-4">{error || "Booking not found."}</p>
        <Link to="/my-bookings" className="block w-full bg-ocean text-white font-bold py-3 rounded-xl">My Bookings</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cloud pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-jungle/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-jungle" />
            </div>
            <h1 className="text-4xl font-black text-ocean mb-2">Booking Confirmed!</h1>
            <p className="text-rock font-medium">Your journey to paradise is all set. Pack your bags!</p>
          </motion.div>

          {/* Ticket/Boarding Pass Layout */}
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-sky/10">
            {/* Ticket Header */}
            <div className="bg-ocean p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 border-b-4 border-dashed border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Plane className="w-6 h-6 text-sunset rotate-45" />
                </div>
                <div>
                  <p className="text-xs font-black text-sky/60 uppercase tracking-widest">Airline</p>
                  <p className="text-xl font-black">HAWAI AIRWAYS</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs font-black text-sky/60 uppercase tracking-widest">Booking Reference</p>
                <p className="text-2xl font-black text-sunset">{booking.bookingId.split('-')[0].toUpperCase()}</p>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-rock/40 uppercase tracking-widest mb-1.5">
                      <User className="w-3 h-3" /> Passenger
                    </label>
                    <p className="text-lg font-black text-ocean">{user?.name || "Guest"}</p>
                    <p className="text-xs font-bold text-rock">{user?.email}</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-rock/40 uppercase tracking-widest mb-1.5">
                      <Calendar className="w-3 h-3" /> Date
                    </label>
                    <p className="text-lg font-black text-ocean">24 Oct, 2024</p>
                    <p className="text-xs font-bold text-rock">Departure: 10:30 AM</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-rock/40 uppercase tracking-widest mb-1.5">
                      <MapPin className="w-3 h-3" /> Route
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-ocean">NYC</span>
                      <ArrowRight className="w-4 h-4 text-tropical" />
                      <span className="text-lg font-black text-ocean">LAX</span>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-rock/40 uppercase tracking-widest mb-1.5">
                      <Armchair className="w-3 h-3" /> Cabin Details
                    </label>
                    <p className="text-lg font-black text-ocean">Seat {booking.seatId}</p>
                    <p className="text-xs font-bold text-tropical">Premium Economy</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-cloud rounded-3xl border-2 border-dashed border-sky/20">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl mb-4 shadow-inner">
                    {/* Placeholder for QR Code */}
                    <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Hawai-Booking')] bg-contain opacity-80" />
                  </div>
                  <p className="text-[10px] font-black text-rock uppercase tracking-[0.2em]">Scan to Board</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mt-12 pt-12 border-t border-sky/10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-tropical/10 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-tropical" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-rock uppercase tracking-widest">Total Paid</p>
                    <p className="text-2xl font-black text-ocean">${booking.price}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-2 bg-cloud hover:bg-sky text-ocean font-black py-3 px-6 rounded-xl transition-all">
                    <Download className="w-5 h-5" /> Download PDF
                  </button>
                  <Link to="/my-bookings" className="flex items-center gap-2 bg-ocean text-white font-black py-3 px-8 rounded-xl hover:bg-tropical transition-all shadow-xl shadow-ocean/20">
                    My Bookings <ChevronLeft className="w-5 h-5 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-rock font-bold text-sm">
            <Link to="/" className="hover:text-ocean flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Home</Link>
            <span className="w-1.5 h-1.5 bg-sky rounded-full" />
            <Link to="/flights" className="hover:text-ocean flex items-center gap-2">Book Another <ChevronLeft className="w-4 h-4 rotate-180" /></Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
