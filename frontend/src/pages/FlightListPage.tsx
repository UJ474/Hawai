import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Plane, 
  Calendar, 
  Clock, 
  MapPin, 
  Filter, 
  ChevronRight, 
  ArrowRightLeft,
  Info,
  Luggage,
  Briefcase,
  AlertCircle,
  Tag,
  Sunrise,
  Sun,
  Sunset,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Flight, FlightFilters } from "../services/flightService";
import { flightService } from "../services/flightService";
import { useAuth } from "../context/AuthContext";

const FlightListPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [source, setSource] = useState(queryParams.get("from") || "");
  const [destination, setDestination] = useState(queryParams.get("to") || "");
  const [date, setDate] = useState(queryParams.get("date") || "");
  const [priceMax, setPriceMax] = useState<number>(1000);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night' | undefined>(undefined);
  const [extraBaggageOnly, setExtraBaggageOnly] = useState(false);

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: FlightFilters = {
        source,
        destination,
        date: date || undefined,
        priceMax,
        timeOfDay
      };
      let fetchedFlights = await flightService.getFlights(filters);
      
      // Client-side filter for extra baggage (simulation)
      if (extraBaggageOnly) {
        fetchedFlights = fetchedFlights.filter(f => parseInt(f.flightId.slice(-1), 16) % 2 === 0);
      }
      
      setFlights(fetchedFlights);
    } catch (err: any) {
      setError(err.message || "Failed to fetch flights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [timeOfDay, extraBaggageOnly]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFlights();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cloud p-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center max-w-md border border-sky/10">
          <div className="w-20 h-20 bg-ocean/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plane className="w-10 h-10 text-ocean rotate-45" />
          </div>
          <h1 className="text-3xl font-bold text-ocean mb-4">View Flights</h1>
          <p className="text-rock font-medium mb-8">Please log in to browse our premium flight selections and manage your journeys.</p>
          <Link to="/login" className="block w-full bg-sunset hover:bg-coral text-white font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-sunset/20">
            Sign In to Hawai
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cloud pb-20">
      {/* Search Header */}
      <div className="bg-ocean pt-32 pb-16 px-6">
        <div className="container mx-auto">
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-[2rem] shadow-2xl flex flex-wrap lg:flex-nowrap gap-4 items-end border border-white/10">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-black text-ocean uppercase tracking-widest mb-1.5 ml-4">Origin</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tropical" />
                <input
                  type="text"
                  className="w-full bg-cloud border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-ocean focus:ring-2 focus:ring-tropical/20"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Where from?"
                />
              </div>
            </div>
            
            <div className="hidden lg:flex items-center justify-center mb-3">
              <ArrowRightLeft className="w-5 h-5 text-rock/30" />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-black text-ocean uppercase tracking-widest mb-1.5 ml-4">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tropical" />
                <input
                  type="text"
                  className="w-full bg-cloud border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-ocean focus:ring-2 focus:ring-tropical/20"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to?"
                />
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-[10px] font-black text-ocean uppercase tracking-widest mb-1.5 ml-4">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tropical" />
                <input
                  type="date"
                  className="w-full bg-cloud border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-ocean focus:ring-2 focus:ring-tropical/20"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full lg:w-auto bg-sunset hover:bg-coral text-white font-black py-3 px-10 rounded-xl transition-all shadow-lg shadow-sunset/20 whitespace-nowrap"
              disabled={loading}
            >
              {loading ? "Searching..." : "Update Results"}
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-72 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-ocean/5 border border-sky/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-tropical" />
                  <h3 className="font-bold text-ocean">Filters</h3>
                </div>
                <button 
                  onClick={() => {setTimeOfDay(undefined); setPriceMax(1000); setExtraBaggageOnly(false); fetchFlights();}}
                  className="text-[10px] font-black text-tropical uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="text-xs font-black text-rock uppercase tracking-widest mb-4 block">Time of Day</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'morning', label: 'Morning', icon: Sunrise },
                      { id: 'afternoon', label: 'Afternoon', icon: Sun },
                      { id: 'evening', label: 'Evening', icon: Sunset },
                      { id: 'night', label: 'Night', icon: Moon }
                    ].map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setTimeOfDay(t.id as any)}
                        className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                          timeOfDay === t.id ? 'bg-tropical text-white border-tropical shadow-lg shadow-tropical/20' : 'bg-cloud border-sky/20 text-ocean hover:border-tropical'
                        }`}
                      >
                        <t.icon className={`w-4 h-4 ${timeOfDay === t.id ? 'text-white' : 'text-tropical'}`} />
                        <span className="text-[9px] font-black uppercase">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-rock uppercase tracking-widest mb-4 block">Max Price: ${priceMax}</label>
                  <input 
                    type="range" 
                    className="w-full accent-tropical" 
                    min="100" 
                    max="1000" 
                    step="50"
                    value={priceMax}
                    onChange={(e) => setPriceMax(parseInt(e.target.value))}
                    onMouseUp={fetchFlights}
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-rock">
                    <span>$100</span>
                    <span>$1000</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-rock uppercase tracking-widest mb-4 block">Preference</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={extraBaggageOnly}
                          onChange={(e) => setExtraBaggageOnly(e.target.checked)}
                          className="w-5 h-5 rounded-lg border-2 border-sky/30 text-tropical focus:ring-tropical transition-all" 
                        />
                      </div>
                      <span className="text-xs font-bold text-ocean group-hover:text-tropical transition-colors">Extra Baggage Included</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group opacity-40">
                      <input type="checkbox" disabled className="w-5 h-5 rounded-lg border-2 border-sky/30" />
                      <span className="text-xs font-bold text-ocean">Refundable Fare</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-tropical to-ocean p-8 rounded-[2.5rem] text-white shadow-xl shadow-tropical/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <Luggage className="w-8 h-8 mb-6 opacity-50" />
              <h4 className="text-xl font-black mb-2">Extra Bag?</h4>
              <p className="text-xs text-sky/70 font-medium leading-relaxed mb-6">Pre-book your excess baggage now and save up to 20% on airport rates.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-sm">Add Baggage</button>
            </div>
          </div>

          {/* Main Results */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between mb-2 px-4">
              <p className="text-sm font-bold text-ocean/60 uppercase tracking-widest">
                Showing <span className="text-ocean">{flights.length} flights</span> for your journey
              </p>
              <div className="flex items-center gap-4">
                <Tag className="w-4 h-4 text-tropical" />
                <span className="text-xs font-black text-tropical uppercase tracking-widest">Cheapest Fare Guarantee</span>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Plane className="w-12 h-12 text-tropical/20" />
                </motion.div>
                <p className="mt-4 text-sm font-bold text-ocean animate-pulse uppercase tracking-widest">Updating results...</p>
              </div>
            ) : error ? (
              <div className="bg-coral/10 border border-coral/20 text-coral p-8 rounded-[2.5rem] flex items-center gap-4">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="font-bold">{error}</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {flights.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-24 rounded-[3rem] text-center shadow-xl border border-sky/10"
                  >
                    <Plane className="w-20 h-20 text-rock/10 mx-auto mb-8 -rotate-12" />
                    <h3 className="text-2xl font-black text-ocean mb-3">No Flights Available</h3>
                    <p className="text-rock font-medium max-w-sm mx-auto">Try adjusting your filters or search for another date.</p>
                    <button onClick={() => {setSource(''); setDestination(''); setDate(''); setTimeOfDay(undefined); setExtraBaggageOnly(false); fetchFlights();}} className="mt-8 text-tropical font-black uppercase tracking-widest text-xs hover:underline">Clear all filters</button>
                  </motion.div>
                ) : (
                  flights.map((flight, idx) => (
                    <motion.div
                      key={flight.flightId}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-[2.5rem] shadow-xl shadow-ocean/5 border border-sky/5 overflow-hidden hover:border-tropical/30 transition-all group"
                    >
                      <div className="p-8 md:p-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                          {/* Airline & ID */}
                          <div className="flex items-center gap-5 min-w-[160px]">
                            <div className="w-14 h-14 bg-ocean rounded-2xl flex items-center justify-center shadow-lg shadow-ocean/10 group-hover:scale-110 transition-transform duration-500">
                              <Plane className="w-7 h-7 text-white rotate-45" />
                            </div>
                            <div>
                              <p className="text-xl font-black text-ocean tracking-tighter">HAWAI</p>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black text-rock uppercase tracking-widest">{flight.flightNumber}</span>
                                <span className="w-1 h-1 rounded-full bg-sky" />
                                <span className="text-[10px] font-bold text-tropical">A320</span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="flex-1 flex items-center justify-between gap-6 w-full">
                            <div className="text-center lg:text-left">
                              <p className="text-3xl font-black text-ocean">
                                {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="text-sm font-black text-rock uppercase tracking-widest mt-1">{flight.source}</p>
                            </div>

                            <div className="flex-1 flex flex-col items-center">
                              <p className="text-[10px] font-black text-rock/30 uppercase tracking-[0.3em] mb-3">2h 15m</p>
                              <div className="w-full flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-sky" />
                                <div className="flex-1 h-px bg-gradient-to-r from-sky via-tropical/30 to-sky border-dashed border-sky/20" />
                                <Plane className="w-5 h-5 text-tropical group-hover:translate-x-2 transition-transform duration-700" />
                                <div className="flex-1 h-px bg-gradient-to-r from-sky via-tropical/30 to-sky border-dashed border-sky/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-tropical shadow-lg shadow-tropical/20" />
                              </div>
                              <p className="text-[10px] font-bold text-jungle uppercase tracking-widest mt-3">Direct Flight</p>
                            </div>

                            <div className="text-center lg:text-right">
                              <p className="text-3xl font-black text-ocean">
                                {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="text-sm font-black text-rock uppercase tracking-widest mt-1">{flight.destination}</p>
                            </div>
                          </div>

                          {/* Pricing & CTA */}
                          <div className="flex flex-col items-center lg:items-end gap-4 min-w-[200px] lg:border-l lg:border-sky/10 lg:pl-12">
                            <div className="text-right">
                              <p className="text-[10px] font-black text-rock/40 uppercase tracking-widest line-through mb-1">$299</p>
                              <p className="text-4xl font-black text-ocean tracking-tighter">$199</p>
                              <p className="text-[9px] font-bold text-rock uppercase mt-1">Per Adult</p>
                            </div>
                            <Link
                              to={`/flights/${flight.flightId}`}
                              className="w-full bg-ocean hover:bg-tropical text-white text-xs font-black py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-ocean/10"
                            >
                              Book Now
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>

                        {/* Amenities Row */}
                        <div className="mt-10 pt-6 border-t border-sky/5 flex flex-wrap items-center justify-between gap-6">
                          <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2 group/icon">
                              <Luggage className="w-4 h-4 text-rock/40 group-hover/icon:text-tropical transition-colors" />
                              <span className="text-[10px] font-bold text-rock uppercase tracking-widest">7kg Cabin</span>
                            </div>
                            <div className="flex items-center gap-2 group/icon">
                              <Briefcase className="w-4 h-4 text-rock/40 group-hover/icon:text-tropical transition-colors" />
                              <span className="text-[10px] font-bold text-rock uppercase tracking-widest">15kg Check-in</span>
                            </div>
                            <div className="flex items-center gap-2 group/icon">
                              <Clock className="w-4 h-4 text-rock/40 group-hover/icon:text-tropical transition-colors" />
                              <span className="text-[10px] font-bold text-jungle uppercase tracking-widest">On Time</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-cloud rounded-lg text-[9px] font-black text-ocean uppercase tracking-widest border border-sky/10">Standard Fare</span>
                            <span className="text-[10px] font-bold text-tropical hover:underline cursor-pointer">Fare Rules & Benefits</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightListPage;
