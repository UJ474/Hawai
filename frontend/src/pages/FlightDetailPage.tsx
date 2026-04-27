import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Plane, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ChevronLeft, 
  Armchair,
  CheckCircle2,
  AlertCircle,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { flightService } from "../services/flightService";
import type { Flight, Seat } from "../services/flightService";
import { bookingService } from "../services/bookingService";
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

  const handleBookSeat = async () => {
    if (!selectedSeat || !flight || !user) {
      setBookingError("Please select a seat and ensure you are logged in.");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    try {
      const price = selectedSeat.seatType === "BUSINESS" ? 499 : 199;
      const newBooking = await bookingService.createBooking(
        flight.flightId,
        user.id,
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

  if (loading) return (
    <div className="min-h-screen bg-cloud flex items-center justify-center">
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Plane className="w-12 h-12 text-tropical mb-4" />
        </motion.div>
        <p className="text-ocean font-bold animate-pulse">Loading Flight Details...</p>
      </div>
    </div>
  );

  if (error || !flight) return (
    <div className="min-h-screen bg-cloud flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl text-center max-w-md border border-sky/10">
        <AlertCircle className="w-16 h-16 text-coral mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-ocean mb-2">Oops!</h2>
        <p className="text-rock font-medium mb-8">{error || "Flight not found."}</p>
        <Link to="/flights" className="block w-full bg-ocean text-white font-bold py-3 rounded-xl">Back to Flights</Link>
      </div>
    </div>
  );

  const rows = [];
  const seatsPerRow = 4;
  if (flight.seats) {
    for (let i = 0; i < flight.seats.length; i += seatsPerRow) {
      rows.push(flight.seats.slice(i, i + seatsPerRow));
    }
  }

  return (
    <div className="min-h-screen bg-cloud pb-20 pt-28">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Seat Map */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-sky/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black text-ocean mb-2">Select Your Seat</h2>
                  <p className="text-rock font-medium">Choose from our premium cabin options</p>
                </div>
                <Link to="/flights" className="text-tropical font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  <ChevronLeft className="w-5 h-5" /> Back
                </Link>
              </div>

              {/* Aircraft Illustration Wrapper */}
              <div className="relative max-w-md mx-auto bg-cloud/50 rounded-t-[10rem] rounded-b-[4rem] p-12 border-x-8 border-t-8 border-sky/20">
                {/* Cockpit */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-sky/10 rounded-t-[10rem] flex items-center justify-center">
                  <div className="w-16 h-8 bg-sky/30 rounded-full blur-xl" />
                </div>

                {/* Seat Map */}
                <div className="space-y-6 relative z-10 pt-20 pb-10">
                  {rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex justify-center gap-4">
                      {row.map((seat, seatIdx) => (
                        <React.Fragment key={seat.seatId}>
                          <button
                            disabled={seat.status === "OCCUPIED" || bookingLoading}
                            onClick={() => setSelectedSeat(seat)}
                            className={`
                              relative w-12 h-12 md:w-14 md:h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-300
                              ${seat.status === "OCCUPIED" ? "bg-rock/10 cursor-not-allowed" : 
                                selectedSeat?.seatId === seat.seatId ? "bg-sunset text-white shadow-lg shadow-sunset/30 scale-110" : 
                                "bg-white border-2 border-sky/30 text-ocean hover:border-tropical hover:text-tropical"}
                            `}
                          >
                            <Armchair className={`w-6 h-6 mb-1 ${seat.status === "OCCUPIED" ? "opacity-20" : ""}`} />
                            <span className="text-[9px] font-black">{seat.seatNumber}</span>
                            {seat.status === "OCCUPIED" && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-0.5 bg-rock/20 rotate-45" />
                              </div>
                            )}
                          </button>
                          {seatIdx === 1 && <div className="w-12" />} {/* Aisle */}
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Exit Row Indicators */}
                <div className="flex justify-between px-2 text-[10px] font-black text-rock/20 uppercase tracking-widest mt-10">
                  <span>Exit Row</span>
                  <span>Exit Row</span>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-12 flex flex-wrap justify-center gap-8 border-t border-sky/10 pt-8">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-white border-2 border-sky/30" />
                  <span className="text-xs font-bold text-rock uppercase">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-sunset shadow-md" />
                  <span className="text-xs font-bold text-rock uppercase">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-rock/10" />
                  <span className="text-xs font-bold text-rock uppercase">Occupied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Info & Summary */}
          <div className="lg:w-1/3 space-y-6">
            {/* Flight Card */}
            <div className="bg-ocean rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <Plane className="w-8 h-8 text-sunset mb-6" />
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-2xl font-black">{flight.source}</p>
                  <p className="text-xs font-bold text-sky/60 uppercase">{new Date(flight.departureTime).toLocaleDateString()}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-tropical" />
                <div className="text-right">
                  <p className="text-2xl font-black">{flight.destination}</p>
                  <p className="text-xs font-bold text-sky/60 uppercase">{new Date(flight.arrivalTime).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-sky/60 font-bold uppercase tracking-widest text-[10px]">Flight No</span>
                  <span className="font-black uppercase">{flight.flightNumber}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-sky/60 font-bold uppercase tracking-widest text-[10px]">Aircraft</span>
                  <span className="font-black uppercase">{flight.aircraftId}</span>
                </div>
              </div>
            </div>

            {/* Selection Summary */}
            <AnimatePresence mode="wait">
              {selectedSeat ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-2 border-tropical shadow-tropical/10"
                >
                  <h3 className="text-xl font-black text-ocean mb-6">Booking Summary</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-4 bg-cloud rounded-2xl">
                      <div>
                        <p className="text-[10px] font-black text-rock uppercase tracking-widest">Selected Seat</p>
                        <p className="text-lg font-black text-ocean">{selectedSeat.seatNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-rock uppercase tracking-widest">Class</p>
                        <p className="text-lg font-black text-tropical">{selectedSeat.seatType}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <span className="text-rock font-bold">Base Fare</span>
                      <span className="font-black text-ocean">${selectedSeat.seatType === 'BUSINESS' ? '499' : '199'}</span>
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <span className="text-rock font-bold">Taxes & Fees</span>
                      <span className="font-black text-ocean">$45</span>
                    </div>
                    <div className="pt-4 border-t border-sky/10 flex justify-between items-center px-4">
                      <span className="text-ocean font-black text-lg">Total Amount</span>
                      <span className="text-2xl font-black text-tropical">${(selectedSeat.seatType === 'BUSINESS' ? 499 : 199) + 45}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBookSeat}
                    disabled={bookingLoading}
                    className="w-full bg-sunset hover:bg-coral text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-sunset/30 flex items-center justify-center gap-3 group"
                  >
                    {bookingLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <CreditCard className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Confirm & Pay
                      </>
                    )}
                  </button>
                  {bookingError && <p className="text-coral text-xs font-bold text-center mt-4">{bookingError}</p>}
                </motion.div>
              ) : (
                <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-10 text-center border border-dashed border-sky/30">
                  <Armchair className="w-12 h-12 text-sky/30 mx-auto mb-4" />
                  <p className="text-rock font-bold italic">Please select a seat to proceed with your booking.</p>
                </div>
              )}
            </AnimatePresence>

            {/* Travel Perks */}
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-sky/5">
              <h4 className="font-black text-ocean text-xs uppercase tracking-widest mb-4">Your Flight Perks</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-rock">
                  <CheckCircle2 className="w-4 h-4 text-jungle" /> Free 15kg Baggage
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-rock">
                  <CheckCircle2 className="w-4 h-4 text-jungle" /> In-flight Meal Selection
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-rock">
                  <CheckCircle2 className="w-4 h-4 text-jungle" /> Flexible Cancellation
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FlightDetailPage;
