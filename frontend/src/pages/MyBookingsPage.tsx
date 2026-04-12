import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingService, Booking } from "../services/bookingService";
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-500">{error}</p>
        <Link to="/flights" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Flights
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

        {bookings.length === 0 && <p className="text-center text-gray-600">You have no bookings yet.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.bookingId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking ID: {booking.bookingId}</h2>
                <p className="text-gray-600">Flight ID: {booking.flightId}</p>
                <p className="text-gray-600">Seat ID: {booking.seatId}</p>
                <p className={`text-sm font-medium ${booking.status === "CANCELED" ? "text-red-500" : "text-green-600"} mb-4`}>
                  Status: {booking.status}
                </p>
                <Link
                  to={`/booking/${booking.bookingId}`}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
