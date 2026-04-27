import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Plane, 
  ChevronLeft, 
  Armchair,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Coffee,
  Zap,
  Lock,
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Phone
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
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'phone' | 'details' | 'processing' | 'otp' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      const seatsToBook = selectedSeats.map(s => ({
        seatNumber: s.seatNumber,
        price: getSeatPrice(s)
      }));
      
      const bookings = await bookingService.createManyBookings(
        flight.flightId,
        user.id,
        seatsToBook
      );
      
      setPaymentStep('success');
      setTimeout(() => {
        navigate(`/booking/${bookings[0].bookingId}`);
      }, 2000);
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

          {/* Checkout Panel */}
          <div className="lg:w-96 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-sky/5">
              <h3 className="text-sm font-black text-ocean uppercase tracking-widest mb-6">Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border border-sky/30 rounded" /> <span className="text-[10px] font-bold text-rock">Available</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-sunset rounded shadow-sm" /> <span className="text-[10px] font-bold text-rock">Selected</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-rock/5 rounded" /> <span className="text-[10px] font-bold text-rock">Occupied</span></div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedSeats.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-ocean rounded-[3rem] p-10 text-white shadow-2xl"
                >
                  <h3 className="text-2xl font-black mb-8">{selectedSeats.length === 1 ? "1 Seat" : `${selectedSeats.length} Seats`} Selected</h3>
                  <div className="space-y-4 mb-10 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedSeats.map(s => (
                      <div key={s.seatId} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div>
                          <p className="text-xl font-black text-sunset">{s.seatNumber}</p>
                          <p className="text-[9px] font-black text-sky/40 uppercase tracking-widest">{getSeatLabel(s)}</p>
                        </div>
                        <p className="text-lg font-black">${getSeatPrice(s)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 pt-6 border-t border-white/10 mb-8">
                    <div className="flex justify-between text-xs font-bold text-sky/60"><span>Base Fare</span> <span>${totalBaseFare}</span></div>
                    <div className="flex justify-between text-xs font-bold text-sky/60"><span>Fees & Taxes</span> <span>${convenienceFee + taxes}</span></div>
                    <div className="flex justify-between items-center pt-4"><span className="font-black text-lg">Total</span> <span className="text-3xl font-black text-sunset">${grandTotal}</span></div>
                  </div>
                  <button onClick={handleStartPayment} className="w-full bg-white text-ocean hover:bg-sunset hover:text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group">
                    Proceed to Payment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ) : (
                <div className="bg-white p-12 rounded-[3rem] text-center border-2 border-dashed border-sky/20">
                  <Armchair className="w-16 h-16 text-sky/20 mx-auto mb-6" />
                  <p className="text-rock font-bold italic">Select your seat(s) to continue.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <AnimatePresence>
        {showPaymentGateway && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentGateway(false)} className="absolute inset-0 bg-ocean/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative z-10 border border-sky/10">
              
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ocean rounded-xl flex items-center justify-center"><Lock className="w-5 h-5 text-white" /></div>
                    <h3 className="text-xl font-black text-ocean">Hawai SecurePay</h3>
                  </div>
                  <button onClick={() => setShowPaymentGateway(false)} className="w-10 h-10 bg-cloud rounded-full flex items-center justify-center hover:bg-coral/10 hover:text-coral transition-all"><X className="w-5 h-5" /></button>
                </div>

                {paymentStep === 'phone' && (
                  <form onSubmit={handleConfirmPhone} className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-tropical/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-tropical" />
                      </div>
                      <h4 className="text-2xl font-black text-ocean mb-2">Mobile Verification</h4>
                      <p className="text-rock font-medium text-sm px-10">We'll send a secure OTP to this number for your booking.</p>
                    </div>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rock/30" />
                      <input 
                        required
                        type="tel" 
                        placeholder="Mobile Number" 
                        className="w-full bg-cloud border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-ocean focus:ring-2 focus:ring-tropical/20"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="w-full bg-ocean text-white font-black py-4 rounded-2xl shadow-xl shadow-ocean/20 hover:bg-tropical transition-all">Send OTP</button>
                  </form>
                )}

                {paymentStep === 'details' && (
                  <div className="space-y-6">
                    <div className="bg-cloud p-6 rounded-3xl flex justify-between items-center">
                      <p className="font-bold text-ocean">Amount to Pay</p>
                      <p className="text-3xl font-black text-ocean">${grandTotal}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rock/30" />
                        <input type="text" placeholder="Card Number" className="w-full bg-cloud border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-ocean" defaultValue="4242 4242 4242 4242" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/YY" className="bg-cloud border-none rounded-2xl py-4 px-6 font-bold text-ocean" defaultValue="12/28" />
                        <input type="text" placeholder="CVV" className="bg-cloud border-none rounded-2xl py-4 px-6 font-bold text-ocean" defaultValue="123" />
                      </div>
                    </div>
                    <button onClick={handleProcessPayment} className="w-full bg-ocean text-white font-black py-4 rounded-2xl shadow-xl shadow-ocean/20 hover:bg-tropical transition-all">Pay Securely</button>
                  </div>
                )}

                {paymentStep === 'processing' && (
                  <div className="py-20 text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block mb-8">
                      <div className="w-20 h-20 border-4 border-ocean/10 border-t-ocean rounded-full" />
                    </motion.div>
                    <h4 className="text-2xl font-black text-ocean mb-2">Processing Payment</h4>
                    <p className="text-rock font-medium">Please do not refresh or close this window.</p>
                  </div>
                )}

                {paymentStep === 'otp' && (
                  <div className="space-y-8 py-4">
                    <div className="text-center">
                      <ShieldCheck className="w-16 h-16 text-tropical mx-auto mb-6" />
                      <h4 className="text-2xl font-black text-ocean mb-2">Secure OTP</h4>
                      <p className="text-rock font-medium text-sm">Enter the code sent to your mobile</p>
                    </div>
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => otpRefs.current[i] = el}
                          type="text"
                          maxLength={1}
                          className="w-12 h-14 bg-cloud border-none rounded-xl text-center text-xl font-black text-ocean focus:ring-2 focus:ring-tropical/20"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        />
                      ))}
                    </div>
                    <button onClick={handleConfirmBooking} className="w-full bg-jungle text-white font-black py-4 rounded-2xl shadow-xl shadow-jungle/20 hover:opacity-90 transition-all flex items-center justify-center gap-3">
                      {bookingLoading ? "Verifying..." : "Verify & Book"}
                    </button>
                    <button className="w-full text-xs font-black text-tropical uppercase tracking-widest hover:underline">Resend OTP</button>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="py-10 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} className="w-24 h-24 bg-jungle/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-12 h-12 text-jungle" />
                    </motion.div>
                    <h4 className="text-3xl font-black text-ocean mb-4">Success!</h4>
                    <p className="text-rock font-medium">Your tickets have been issued. Happy flying!</p>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlightDetailPage;
