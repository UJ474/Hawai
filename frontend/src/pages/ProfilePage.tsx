import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookingService, Booking } from "../services/bookingService";

const ProfilePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const fetchedBookings = await bookingService.getBookingsByPassengerId(user.id);
        setBookings(fetchedBookings);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile</h1>
        <p className="text-lg text-gray-600">Please log in to view your profile.</p>
        <Link to="/login" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");
  const canceledBookings = bookings.filter(b => b.status === "CANCELED");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Profile card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-500 text-lg">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600">{bookings.length}</p>
            <p className="text-gray-500">Total Bookings</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{confirmedBookings.length}</p>
            <p className="text-gray-500">Active Bookings</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-red-500">{canceledBookings.length}</p>
            <p className="text-gray-500">Cancelled</p>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Recent Bookings</h2>
            <Link to="/my-bookings" className="text-indigo-600 hover:underline text-sm">
              View All →
            </Link>
          </div>

          {loading && <p className="text-gray-500 text-center py-4">Loading...</p>}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No bookings yet.</p>
              <Link to="/flights" className="text-indigo-600 hover:underline">
                Browse Flights →
              </Link>
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.bookingId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    {booking.flight ? (
                      <p className="font-semibold text-gray-800">
                        {booking.flight.source} → {booking.flight.destination}
                      </p>
                    ) : (
                      <p className="font-semibold text-gray-800">Flight {booking.flightId.slice(0, 8)}...</p>
                    )}
                    {booking.seat && (
                      <p className="text-sm text-gray-500">
                        Seat {booking.seat.seatNumber} • {booking.seat.seatType}
                      </p>
                    )}
                    {booking.flight && (
                      <p className="text-xs text-gray-400">
                        {new Date(booking.flight.departureTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${booking.status === "CANCELED" ? "text-red-500" : "text-green-600"}`}>
                      {booking.status}
                    </p>
                    <p className="text-sm font-bold text-gray-700">${(booking.price || 0).toFixed(2)}</p>
                    <Link
                      to={`/booking/${booking.bookingId}`}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
