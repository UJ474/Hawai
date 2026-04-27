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
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Flight } from "../services/flightService";
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

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedFlights = await flightService.getFlights(source, destination, date);
      setFlights(fetchedFlights);
    } catch (err: any) {
      setError(err.message || "Failed to fetch flights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

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
          {/* Sidebar Filters - Simple Placeholder */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-ocean/5 border border-sky/5">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-tropical" />
                <h3 className="font-bold text-ocean">Filters</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-rock uppercase tracking-wider">Price Range</label>
                  <input type="range" className="w-full accent-tropical mt-2" />
                </div>
                <div>
                  <label className="text-xs font-bold text-rock uppercase tracking-wider">Flight Status</label>
                  <div className="space-y-2 mt-2 text-sm font-medium text-ocean">
                    <label className="flex items-center gap-2"><input type="checkbox" className="rounded text-tropical" /> Scheduled</label>
                    <label className="flex items-center gap-2"><input type="checkbox" className="rounded text-tropical" /> On Time</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-tropical to-ocean p-6 rounded-3xl text-white shadow-xl shadow-tropical/20">
              <Info className="w-6 h-6 mb-4 opacity-50" />
              <h4 className="font-bold mb-2">Travel Insurance</h4>
              <p className="text-xs text-sky/70 leading-relaxed mb-4">Protect your journey with Hawai Premium Cover.</p>
              <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 py-2 px-4 rounded-lg transition-all">Learn More</button>
            </div>
          </div>

          {/* Main Results */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-bold text-ocean">
                {flights.length} Flights Available
              </h2>
              <select className="bg-transparent border-none text-sm font-bold text-tropical focus:ring-0 cursor-pointer">
                <option>Sort by Price</option>
                <option>Sort by Time</option>
              </select>
            </div>

            {error && (
              <div className="bg-coral/10 border border-coral/20 text-coral p-6 rounded-3xl font-bold text-center">
                {error}
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {flights.length === 0 && !loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-20 rounded-[3rem] text-center shadow-xl border border-sky/10"
                >
                  <Plane className="w-16 h-16 text-rock/20 mx-auto mb-6 -rotate-12" />
                  <p className="text-xl font-bold text-ocean mb-2">No flights found</p>
                  <p className="text-rock font-medium">Try adjusting your search criteria or dates.</p>
                </motion.div>
              ) : (
                flights.map((flight, idx) => (
                  <motion.div
                    key={flight.flightId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-3xl shadow-xl shadow-ocean/5 border border-sky/5 overflow-hidden hover:border-tropical/30 transition-all group"
                  >
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                      {/* Airline Info */}
                      <div className="flex items-center gap-4 min-w-[140px]">
                        <div className="w-12 h-12 bg-ocean rounded-xl flex items-center justify-center">
                          <Plane className="w-6 h-6 text-white rotate-45" />
                        </div>
                        <div>
                          <p className="font-black text-ocean tracking-tight">HAWAI</p>
                          <p className="text-[10px] font-bold text-rock uppercase tracking-tighter">{flight.flightNumber}</p>
                        </div>
                      </div>

                      {/* Journey Details */}
                      <div className="flex-1 flex items-center justify-between gap-4 w-full">
                        <div className="text-center md:text-left">
                          <p className="text-2xl font-black text-ocean">
                            {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-sm font-bold text-rock">{flight.source}</p>
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                          <p className="text-[10px] font-bold text-rock/40 uppercase tracking-widest mb-1">Direct</p>
                          <div className="w-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-sky" />
                            <div className="flex-1 h-px bg-gradient-to-r from-sky via-tropical/20 to-sky" />
                            <Plane className="w-4 h-4 text-tropical" />
                            <div className="flex-1 h-px bg-gradient-to-r from-sky via-tropical/20 to-sky" />
                            <div className="w-2 h-2 rounded-full bg-sky" />
                          </div>
                        </div>

                        <div className="text-center md:text-right">
                          <p className="text-2xl font-black text-ocean">
                            {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-sm font-bold text-rock">{flight.destination}</p>
                        </div>
                      </div>

                      {/* Price and CTA */}
                      <div className="flex flex-col items-center md:items-end gap-3 min-w-[160px] border-t md:border-t-0 md:border-l border-sky/10 pt-6 md:pt-0 md:pl-8">
                        <p className="text-xs font-bold text-rock uppercase">Starting from</p>
                        <p className="text-3xl font-black text-ocean">$199</p>
                        <Link
                          to={`/flights/${flight.flightId}`}
                          className="w-full bg-ocean hover:bg-tropical text-white text-sm font-black py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-ocean/10"
                        >
                          Book Now
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                    
                    {/* Status Bar */}
                    <div className="bg-cloud px-8 py-2.5 flex items-center justify-between border-t border-sky/5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${flight.status === 'SCHEDULED' ? 'bg-jungle' : 'bg-coral'} animate-pulse`} />
                        <p className="text-[10px] font-bold text-ocean/60 uppercase tracking-widest">
                          {flight.status.replace('_', ' ')}
                        </p>
                      </div>
                      <p className="text-[10px] font-bold text-tropical uppercase tracking-widest">Premium Class Available</p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightListPage;
