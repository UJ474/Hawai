import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { flightService, Flight, Seat } from "../services/flightService";
import { bookingService } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

// Pricing based on seat type
const SEAT_PRICES: Record<string, number> = {
  ECONOMY: 150,
  BUSINESS: 450,
  FIRST_CLASS: 800,
};

const SEAT_TYPE_LABELS: Record<string, string> = {
  ECONOMY: "Economy",
  BUSINESS: "Business",
  FIRST_CLASS: "First Class",
};

const SEAT_TYPE_COLORS: Record<string, { bg: string; selected: string; text: string }> = {
  ECONOMY: { bg: "bg-green-100", selected: "bg-green-500", text: "text-green-800" },
  BUSINESS: { bg: "bg-blue-100", selected: "bg-blue-500", text: "text-blue-800" },
  FIRST_CLASS: { bg: "bg-purple-100", selected: "bg-purple-500", text: "text-purple-800" },
};

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
  const [filterType, setFilterType] = useState<string>("ALL");

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
      const price = SEAT_PRICES[selectedSeat.seatType] || 150;
      const passengerId = user.id;

      const newBooking = await bookingService.createBooking(
        flight.flightId,
        passengerId,
        selectedSeat.seatNumber,
        price
      );
      navigate(`/booking/${newBooking.bookingId}`);
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

  const allSeats = flight.seats || [];
  const availableSeats = allSeats.filter(seat => seat.status === "AVAILABLE");
  const filteredSeats = filterType === "ALL"
    ? availableSeats
    : availableSeats.filter(seat => seat.seatType === filterType);

  // Group seats by type for the legend
  const seatTypeCounts = availableSeats.reduce((acc, seat) => {
    acc[seat.seatType] = (acc[seat.seatType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        {/* Flight Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {flight.source} → {flight.destination}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Departure</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(flight.departureTime).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Arrival</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(flight.arrivalTime).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Status</p>
              <p className={`text-lg font-semibold ${flight.status === "CANCELLED" ? "text-red-500" : flight.status === "DELAYED" ? "text-yellow-600" : "text-green-600"}`}>
                {flight.status.replace("_", " ")}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Available Seats</p>
              <p className="text-lg font-semibold text-gray-800">{availableSeats.length} / {allSeats.length}</p>
            </div>
          </div>
        </div>

        {/* Seat Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Your Seat</h2>

          {/* Seat type pricing legend */}
          <div className="flex flex-wrap gap-4 mb-6">
            {Object.entries(SEAT_TYPE_LABELS).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
                <div className={`w-4 h-4 rounded ${SEAT_TYPE_COLORS[type]?.bg || "bg-gray-200"}`}></div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-bold text-gray-900">${SEAT_PRICES[type]}</span>
                <span className="text-xs text-gray-500">({seatTypeCounts[type] || 0} avail.)</span>
              </div>
            ))}
          </div>

          {/* Filter by seat type */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === "ALL" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              onClick={() => setFilterType("ALL")}
            >
              All Types
            </button>
            {Object.entries(SEAT_TYPE_LABELS).map(([type, label]) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === type ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setFilterType(type)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Seat grid */}
          {filteredSeats.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {filteredSeats.map(seat => {
                const colors = SEAT_TYPE_COLORS[seat.seatType] || { bg: "bg-gray-200", selected: "bg-gray-600", text: "text-gray-800" };
                const isSelected = selectedSeat?.seatId === seat.seatId;
                return (
                  <button
                    key={seat.seatId}
                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? `${colors.selected} text-white shadow-lg scale-105`
                        : `${colors.bg} ${colors.text} hover:opacity-80 hover:shadow-md`
                    }`}
                    onClick={() => handleSeatSelect(seat)}
                    disabled={bookingLoading}
                    title={`${seat.seatNumber} - ${SEAT_TYPE_LABELS[seat.seatType]} - $${SEAT_PRICES[seat.seatType]}`}
                  >
                    <div className="font-bold">{seat.seatNumber}</div>
                    <div className="text-xs opacity-75">{SEAT_TYPE_LABELS[seat.seatType]?.slice(0, 4)}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No available seats{filterType !== "ALL" ? ` in ${SEAT_TYPE_LABELS[filterType]}` : ""}.</p>
          )}
        </div>

        {/* Booking summary */}
        {selectedSeat && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Booking Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Selected Seat</p>
                <p className="text-xl font-bold text-gray-800">{selectedSeat.seatNumber}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Class</p>
                <p className="text-xl font-bold text-gray-800">{SEAT_TYPE_LABELS[selectedSeat.seatType]}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-xl font-bold text-green-600">${SEAT_PRICES[selectedSeat.seatType]}.00</p>
              </div>
            </div>

            {bookingError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                {bookingError}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleBookSeat}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Book Now"}
              </button>
              <Link
                to="/flights"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg focus:outline-none transition-colors"
              >
                Back to Flights
              </Link>
            </div>
          </div>
        )}

        {!selectedSeat && (
          <div className="text-center">
            <Link
              to="/flights"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none transition-colors"
            >
              Back to Flight List
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightDetailPage;
