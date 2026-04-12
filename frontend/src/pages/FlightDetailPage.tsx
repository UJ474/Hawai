import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { flightService, Flight, Seat } from "../services/flightService";
import { bookingService } from "../services/bookingService"; // Import bookingService
import { useAuth } from "../context/AuthContext";

const FlightDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!isAuthenticated) {
        setError("Please log in to view flight details.");
        setLoading(false);
        return;
      }
      if (!id) {
        setError("Flight ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedFlight = await flightService.getFlightById(id);
        setFlight(fetchedFlight);
      } catch (err: any) {
        setError(err.message || "Failed to fetch flight details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [id, isAuthenticated]);

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeat(seat);
  };

  const handleBookSeat = async () => {
    if (!selectedSeat || !flight || !user) {
      setBookingError("Please select a seat and ensure you are logged in.");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    try {
      // Assuming a fixed price for now, or fetch from a pricing service
      const price = 100; 
      // The passenger ID from the logged-in user
      const passengerId = user.id; 

      const newBooking = await bookingService.createBooking(
        flight.flightId,
        passengerId,
        selectedSeat.seatNumber,
        price
      );
      navigate(`/booking/${newBooking.bookingId}`); // Redirect to booking confirmation page
    } catch (err: any) {
      setBookingError(err.message || "Failed to book seat.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Flight Details</h1>
        <p className="text-lg text-gray-600">Please log in to view flight details.</p>
        <Link to="/login" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading flight details...</p>
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

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Flight not found.</p>
        <Link to="/flights" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Flights
        </Link>
      </div>
    );
  }

  const availableSeats = flight.seats?.filter(seat => seat.status === "AVAILABLE") || [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Flight from {flight.source} to {flight.destination}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600"><strong>Flight ID:</strong> {flight.flightId}</p>
            <p className="text-gray-600"><strong>Source:</strong> {flight.source}</p>
            <p className="text-gray-600"><strong>Destination:</strong> {flight.destination}</p>
            <p className="text-gray-600"><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
            <p className="text-gray-600"><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
            <p className="text-gray-600"><strong>Aircraft ID:</strong> {flight.aircraftId}</p>
            <p className={`font-medium ${flight.status === "CANCELLED" ? "text-red-500" : flight.status === "DELAYED" ? "text-yellow-600" : "text-green-600"}`}>
              <strong>Status:</strong> {flight.status.replace("_", " ")}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Available Seats ({availableSeats.length})</h2>
            {availableSeats.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {availableSeats.map(seat => (
                  <button
                    key={seat.seatId}
                    className={`py-2 px-3 rounded-md text-sm font-medium ${
                      selectedSeat?.seatId === seat.seatId
                        ? "bg-blue-500 text-white"
                        : "bg-green-200 text-green-800 hover:bg-green-300"
                    }`}
                    onClick={() => handleSeatSelect(seat)}
                    disabled={bookingLoading}
                  >
                    {seat.seatNumber} ({seat.seatType})
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No available seats for this flight.</p>
            )}
            {bookingError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                {bookingError}
              </div>
            )}
            {selectedSeat && (
              <p className="mt-4 text-lg text-gray-700">Selected Seat: <strong>{selectedSeat.seatNumber}</strong> ({selectedSeat.seatType})</p>
            )}
          </div>
        </div>

        <Link
          to="/flights"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Back to Flight List
        </Link>
        {selectedSeat && (
          <button
            onClick={handleBookSeat}
            className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={bookingLoading}
          >
            {bookingLoading ? "Booking..." : "Book Selected Seat"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FlightDetailPage;
