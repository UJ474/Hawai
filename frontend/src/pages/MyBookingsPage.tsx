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
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchMyBookings();
  }, [isAuthenticated, user]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      await fetchMyBookings(); // Refresh
    } catch (err: any) {
      setError(err.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Bookings</h1>
        <p className="text-lg text-gray-600">Please log in to view your bookings.</p>
        <Link to="/login" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">You have no bookings yet.</p>
            <Link to="/flights" className="text-indigo-600 hover:underline text-lg">
              Browse Flights →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.bookingId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-5">
                {booking.flight ? (
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {booking.flight.source} → {booking.flight.destination}
                  </h2>
                ) : (
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Booking {booking.bookingId.slice(0, 8)}...
                  </h2>
                )}

                {booking.flight && (
                  <>
                    <p className="text-gray-600 text-sm">Flight: {booking.flight.flightNumber}</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(booking.flight.departureTime).toLocaleString()}
                    </p>
                  </>
                )}

                {booking.seat && (
                  <p className="text-gray-600 text-sm mt-1">
                    Seat: {booking.seat.seatNumber} ({booking.seat.seatType})
                  </p>
                )}

                <p className="text-lg font-bold text-gray-800 mt-2">${(booking.price || 0).toFixed(2)}</p>

                <p className={`text-sm font-medium mt-1 ${booking.status === "CANCELED" ? "text-red-500" : "text-green-600"} mb-4`}>
                  Status: {booking.status}
                  {booking.payment && ` • ${booking.payment.status === "COMPLETED" ? "Paid" : "Payment " + booking.payment.status}`}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/booking/${booking.bookingId}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2 px-3 rounded transition-colors"
                  >
                    Details
                  </Link>
                  {booking.status === "CONFIRMED" && !booking.payment && (
                    <Link
                      to={`/pay/${booking.bookingId}`}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-3 rounded transition-colors"
                    >
                      Pay Now
                    </Link>
                  )}
                  {booking.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleCancel(booking.bookingId)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-3 rounded transition-colors"
                      disabled={cancellingId === booking.bookingId}
                    >
                      {cancellingId === booking.bookingId ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
