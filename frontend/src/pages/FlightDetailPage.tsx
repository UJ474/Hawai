import React, { useState, useEffect, useRef } from "react";
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
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!id) return;
      setLoading(true);
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
  }, [id]);

  const getSeatPrice = (seat: Seat) => {
    if (seat.seatType === "BUSINESS") return 499;
    const row = parseInt(seat.seatNumber);
    if (row <= 4) return 249;
    if (row === 6) return 299;
    return 199;
  };

  const getSeatLabel = (seat: Seat) => {
    if (seat.seatType === "BUSINESS") return "Business Class";
    const row = parseInt(seat.seatNumber);
    if (row <= 4) return "Preferred Seat";
    if (row === 6) return "Extra Legroom";
    return "Standard Seat";
  };

  const toggleSeatSelection = (seat: Seat) => {
    if (selectedSeats.find(s => s.seatId === seat.seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s.seatId !== seat.seatId));
    } else {
      if (selectedSeats.length >= 6) {
        alert("Maximum 6 seats allowed per booking.");
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalBaseFare = selectedSeats.reduce((sum, s) => sum + getSeatPrice(s), 0);
  const convenienceFee = selectedSeats.length * 15;
  const taxes = selectedSeats.length * 30;
  const grandTotal = totalBaseFare + convenienceFee + taxes;

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleStartPayment = () => {
    if (selectedSeats.length === 0) return;
    setShowPaymentGateway(true);
    setPaymentStep('phone');
  };

  const handleConfirmPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    setPaymentStep('details');
  };

  const handleProcessPayment = () => {
    setPaymentStep('processing');
    setTimeout(() => setPaymentStep('otp'), 2000);
  };

  const handleConfirmBooking = async () => {
    if (!flight || !user || selectedSeats.length === 0) return;
    setBookingLoading(true);
    try {
      const price = SEAT_PRICES[selectedSeat.seatType] || 150;
      const passengerId = user.id;

      const newBooking = await bookingService.createBooking(
        flight.flightId,
        user.id,
        seatsToBook
      );
      navigate(`/booking/${newBooking.bookingId}`);
    } catch (err: any) {
      alert(err.message || "Failed to confirm booking.");
      setShowPaymentGateway(false);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-cloud flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
        <Plane className="w-12 h-12 text-tropical" />
      </motion.div>
    </div>
  );

  const rows = [];
  const seatsPerRow = 6;
  if (flight?.seats) {
    for (let i = 0; i < flight.seats.length; i += seatsPerRow) {
      rows.push(flight.seats.slice(i, i + seatsPerRow));
    }
  }

  return (
    <div className="min-h-screen bg-cloud pb-20 pt-28">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Seat Map */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-[4rem] shadow-2xl p-10 md:p-16 border border-sky/10 relative">
              <div className="flex items-center justify-between mb-16">
                <div>
                  <h2 className="text-4xl font-black text-ocean mb-2">Select Seats</h2>
                  <p className="text-rock font-medium">Flight {flight?.flightNumber} • {selectedSeats.length > 0 ? `${selectedSeats.length} Selected` : "Choose your seat(s)"}</p>
                </div>
                <Link to="/flights" className="w-12 h-12 bg-cloud rounded-2xl flex items-center justify-center">
                  <ChevronLeft className="w-6 h-6 text-ocean" />
                </Link>
              </div>

              <div className="relative max-w-xl mx-auto bg-[#F8FAFC] rounded-t-[15rem] rounded-b-[6rem] p-16 border-x-[12px] border-t-[12px] border-sky/20">
                <div className="space-y-4 relative z-10 pt-32 pb-20">
                  {rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex justify-center gap-3">
                      {row.map((seat, seatIdx) => {
                        const isSelected = selectedSeats.find(s => s.seatId === seat.seatId);
                        const isOccupied = seat.status === "OCCUPIED" || seat.status === "BOOKED";
                        return (
                          <React.Fragment key={seat.seatId}>
                            <button
                              disabled={isOccupied}
                              onClick={() => toggleSeatSelection(seat)}
                              className={`
                                relative w-11 h-12 md:w-14 md:h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-300
                                ${isOccupied ? "bg-rock/5 cursor-not-allowed text-rock/20" : 
                                  isSelected ? "bg-sunset text-white shadow-2xl shadow-sunset/40 scale-110 z-20" : 
                                  "bg-white border-2 border-sky/20 text-ocean hover:border-tropical hover:text-tropical"}
                              `}
                            >
                              <Armchair className={`w-5 h-5 mb-1 ${isOccupied ? "opacity-10" : ""}`} />
                              <span className="text-[10px] font-black">{seat.seatNumber}</span>
                            </button>
                            {seatIdx === 2 && <div className="w-12" />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
      </AnimatePresence>
    </div>
  );
};

export default FlightDetailPage;
