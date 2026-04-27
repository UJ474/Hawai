import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { bookingService, Booking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!isAuthenticated) {
        setError("Please log in to view booking details.");
        setLoading(false);
        return;
      }
      if (!id) {
        setError("Booking ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
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
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmation</h1>
        <p className="text-lg text-gray-600">Please log in to view your booking.</p>
        <Link to="/login" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-xl text-red-500 mb-4">{error}</p>
        <Link to="/flights" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Flights
        </Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600 mb-4">Booking not found.</p>
        <Link to="/flights" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Flights
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">✅</div>
            <h1 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h1>
          </div>

          {/* Booking details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p className="text-gray-500">Booking ID:</p>
              <p className="font-medium text-gray-800 break-all">{booking.bookingId}</p>

              {booking.flight && (
                <>
                  <p className="text-gray-500">Route:</p>
                  <p className="font-medium text-gray-800">{booking.flight.source} → {booking.flight.destination}</p>
                  <p className="text-gray-500">Flight:</p>
                  <p className="font-medium text-gray-800">{booking.flight.flightNumber}</p>
                  <p className="text-gray-500">Departure:</p>
                  <p className="font-medium text-gray-800">{new Date(booking.flight.departureTime).toLocaleString()}</p>
                  <p className="text-gray-500">Arrival:</p>
                  <p className="font-medium text-gray-800">{new Date(booking.flight.arrivalTime).toLocaleString()}</p>
                </>
              )}

              {booking.seat && (
                <>
                  <p className="text-gray-500">Seat:</p>
                  <p className="font-medium text-gray-800">{booking.seat.seatNumber}</p>
                  <p className="text-gray-500">Class:</p>
                  <p className="font-medium text-gray-800">{booking.seat.seatType}</p>
                </>
              )}

              <p className="text-gray-500">Price:</p>
              <p className="font-bold text-green-600">${(booking.price || 0).toFixed(2)}</p>

              <p className="text-gray-500">Status:</p>
              <p className={`font-medium ${booking.status === "CANCELED" ? "text-red-500" : "text-green-600"}`}>
                {booking.status}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/flights"
              className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Browse Flights
            </Link>
            {booking.status === "CONFIRMED" && !booking.payment && (
              <Link
                to={`/pay/${booking.bookingId}`}
                className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Proceed to Payment
              </Link>
            )}
            <Link
              to="/my-bookings"
              className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
