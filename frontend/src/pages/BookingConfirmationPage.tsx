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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-500">{error}</p>
        <Link to="/flights" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Flights
        </Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Booking not found.</p>
        <Link to="/flights" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Flights
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Confirmed!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600"><strong>Booking ID:</strong> {booking.bookingId}</p>
            <p className="text-gray-600"><strong>Flight ID:</strong> {booking.flightId}</p>
            <p className="text-gray-600"><strong>Passenger ID:</strong> {booking.passengerId}</p>
            <p className="text-gray-600"><strong>Seat ID:</strong> {booking.seatId}</p>
            <p className={`font-medium ${booking.status === "CANCELED" ? "text-red-500" : "text-green-600"}`}>
              <strong>Status:</strong> {booking.status}
            </p>
          </div>
          {/* You would typically display more details here, like flight info, seat number, etc. */}
          {/* For now, just basic booking info */}
        </div>

                  <Link
                    to="/flights"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    View More Flights
                  </Link>
                  {booking.status === "PENDING" && (
                    <Link
                      to={`/pay/${booking.bookingId}`}
                      className="ml-4 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Proceed to Payment
                    </Link>
                  )}
                  <Link
                    to="/my-bookings"
                    className="ml-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    View My Bookings
                  </Link>
                </div>    </div>
  );
};

export default BookingConfirmationPage;
