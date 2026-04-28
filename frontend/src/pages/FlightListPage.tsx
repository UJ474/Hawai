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

  const handleClearFilters = () => {
    setSource("");
    setDestination("");
    setDate("");
    // Fetch all flights after clearing
    setTimeout(() => fetchFlights(), 0);
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Flights</h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="source" className="block text-gray-700 text-sm font-bold mb-2">
                Origin:
              </label>
              <input
                type="text"
                id="source"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g., New York"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="destination" className="block text-gray-700 text-sm font-bold mb-2">
                Destination:
              </label>
              <input
                type="text"
                id="destination"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Los Angeles"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
                Date:
              </label>
              <input
                type="date"
                id="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search Flights"}
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        {loading && <p className="text-center text-gray-600">Loading flights...</p>}

        {!loading && flights.length === 0 && <p className="text-center text-gray-600">No flights found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <div key={flight.flightId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {flight.source} → {flight.destination}
                </h2>
                <p className="text-gray-600 mb-1">
                  Departure: {new Date(flight.departureTime).toLocaleString()}
                </p>
                <p className="text-gray-600 mb-3">
                  Arrival: {new Date(flight.arrivalTime).toLocaleString()}
                </p>
                <p className={`text-sm font-medium ${flight.status === "CANCELLED" ? "text-red-500" : flight.status === "DELAYED" ? "text-yellow-600" : "text-green-600"} mb-4`}>
                  Status: {flight.status.replace("_", " ")}
                </p>
                <Link
                  to={`/flights/${flight.flightId}`}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Book Now
                </Link>
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
