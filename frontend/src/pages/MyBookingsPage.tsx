import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Plane, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Ticket, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Booking } from "../services/bookingService";
import { bookingService } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

const MyBookingsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!isAuthenticated || !user?.id) {
        setError("Please log in to view your bookings.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedBookings = await bookingService.getBookingsByPassengerId(user.id);
        setBookings(fetchedBookings);
      } catch (err: any) {
        setError(err.message || "Failed to fetch your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cloud flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center max-w-md border border-sky/10">
          <div className="w-20 h-20 bg-ocean/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-10 h-10 text-ocean -rotate-12" />
          </div>
          <h1 className="text-3xl font-bold text-ocean mb-4">Your Trips</h1>
          <p className="text-rock font-medium mb-8">Sign in to view your flight history, boarding passes, and manage your upcoming journeys.</p>
          <Link to="/login" className="block w-full bg-sunset hover:bg-coral text-white font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-sunset/20">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cloud pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-ocean mb-2">My Journeys</h1>
            <p className="text-rock font-medium">Manage and view all your flight reservations</p>
          </div>
          <Link to="/flights" className="bg-white text-tropical font-black py-3 px-8 rounded-2xl shadow-xl shadow-ocean/5 border border-sky/10 hover:shadow-2xl transition-all flex items-center gap-2">
            <Plane className="w-5 h-5 rotate-45" />
            Book New Flight
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Clock className="w-12 h-12 text-tropical mb-4" />
            </motion.div>
            <p className="text-ocean font-bold animate-pulse">Fetching your trips...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center border border-coral/10">
            <AlertCircle className="w-12 h-12 text-coral mx-auto mb-4" />
            <p className="text-xl font-bold text-ocean mb-2">Something went wrong</p>
            <p className="text-rock font-medium">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-20 rounded-[3rem] text-center shadow-2xl border border-sky/10"
          >
            <Ticket className="w-16 h-16 text-rock/20 mx-auto mb-6" />
            <p className="text-2xl font-bold text-ocean mb-2">No bookings yet</p>
            <p className="text-rock font-medium mb-10">You haven't made any flight reservations yet. Ready to start your adventure?</p>
            <Link to="/flights" className="inline-block bg-ocean text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-ocean/20 hover:bg-tropical transition-all">
              Search Flights
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {bookings.map((booking, idx) => (
                <motion.div
                  key={booking.bookingId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[2rem] shadow-xl shadow-ocean/5 border border-sky/5 overflow-hidden hover:shadow-2xl hover:border-tropical/20 transition-all group"
                >
                  <div className="p-8 flex flex-col lg:flex-row items-center gap-10">
                    {/* Status Badge */}
                    <div className="lg:w-32 flex flex-col items-center justify-center">
                      {booking.status === 'CONFIRMED' ? (
                        <div className="w-12 h-12 bg-jungle/10 rounded-full flex items-center justify-center mb-2">
                          <CheckCircle2 className="w-6 h-6 text-jungle" />
                        </div>
                      ) : booking.status === 'CANCELED' ? (
                        <div className="w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center mb-2">
                          <XCircle className="w-6 h-6 text-coral" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-2">
                          <Clock className="w-6 h-6 text-gold" />
                        </div>
                      )}
                      <p className={`text-[10px] font-black uppercase tracking-widest ${
                        booking.status === 'CONFIRMED' ? 'text-jungle' : 
                        booking.status === 'CANCELED' ? 'text-coral' : 'text-gold'
                      }`}>
                        {booking.status}
                      </p>
                    </div>

                    {/* Flight Details Summary */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                      <div>
                        <p className="text-[10px] font-black text-rock uppercase tracking-widest mb-1">Booking Ref</p>
                        <p className="font-black text-ocean uppercase">{booking.bookingId.split('-')[0]}</p>
                        <p className="text-xs font-bold text-rock mt-1">Class: Economy Premium</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-cloud rounded-lg flex items-center justify-center">
                          <Plane className="w-5 h-5 text-tropical" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-rock uppercase tracking-widest mb-0.5">Flight ID</p>
                          <p className="font-black text-ocean">{booking.flightId.split('-')[0]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-cloud rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-tropical" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-rock uppercase tracking-widest mb-0.5">Seat No</p>
                          <p className="font-black text-ocean uppercase">{booking.seatId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 w-full border-t lg:border-t-0 lg:border-l border-sky/10 pt-6 lg:pt-0 lg:pl-10">
                      <Link
                        to={`/booking/${booking.bookingId}`}
                        className="w-full bg-cloud hover:bg-sky text-ocean text-sm font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        View Pass
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
