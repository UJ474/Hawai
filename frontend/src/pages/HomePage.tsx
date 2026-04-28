import React, { useState } from 'react';
import { Plane, Search, Calendar, MapPin, ArrowRight, Shield, Globe, Clock, Users, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip' | 'multiCity'>('oneWay');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  const [showTravelers, setShowTravelers] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState('Economy/Premium Economy');

  const features = [
    { icon: Shield, title: 'Safe Travel', desc: 'Verified airlines and secure payment processing for your peace of mind.' },
    { icon: Globe, title: 'Global Reach', desc: 'Over 500+ destinations worldwide at the most competitive prices.' },
    { icon: Clock, title: '24/7 Support', desc: 'Our dedicated team is always here to help you with your journey.' },
  ];

  const handleSearch = () => {
    let url = `/flights?from=${from}&to=${to}&date=${date}&adults=${adults}&children=${children}&infants=${infants}&class=${travelClass}`;
    if (tripType === 'roundTrip' && returnDate) {
      url += `&returnDate=${returnDate}`;
    }
    navigate(url);
  };

  return (
    <div className="min-h-screen bg-cloud font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 flex items-start justify-center overflow-hidden min-h-[650px]">
        {/* Background */}
        <div className="absolute inset-0 bg-ocean">
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109c05d?auto=format&fit=crop&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/90 via-[#0a192f]/80 to-cloud" />
        </div>

        <div className="container mx-auto px-6 relative z-10 w-full max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
             <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
              Book Flights & <span className="text-tropical underline decoration-tropical/40 decoration-4 underline-offset-8">Explore</span> The World
            </h1>
          </motion.div>

          {/* MMT Style Search Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-sky/10 relative"
          >
            {/* Trip Type Radio Buttons */}
            <div className="flex items-center gap-6 mb-8 border-b border-sky/10 pb-4">
              {[
                { id: 'oneWay', label: 'One Way' },
                { id: 'roundTrip', label: 'Round Trip' },
                { id: 'multiCity', label: 'Multi City' },
              ].map((type) => (
                <label key={type.id} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${tripType === type.id ? 'border-ocean' : 'border-rock/30 group-hover:border-ocean/50'}`}>
                    {tripType === type.id && <div className="w-2.5 h-2.5 rounded-full bg-ocean" />}
                  </div>
                  <span className={`text-sm font-bold ${tripType === type.id ? 'text-ocean' : 'text-rock group-hover:text-ocean/80'}`}>{type.label}</span>
                </label>
              ))}
              <div className="ml-auto text-sm font-bold text-ocean hover:text-tropical cursor-pointer">
                Book International and Domestic Flights
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_1.5fr] gap-4 mb-10">
              
              {/* FROM */}
              <div className="border border-sky/30 rounded-xl p-3 hover:bg-sky/5 cursor-text group transition-colors">
                <span className="text-[11px] font-bold text-rock uppercase tracking-wider block mb-1">From</span>
                <input 
                  type="text" 
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Delhi"
                  className="w-full text-3xl font-black text-ocean bg-transparent border-none p-0 focus:ring-0 placeholder:text-rock/30 outline-none"
                />
                <span className="text-xs text-ocean/80 font-medium block mt-1 truncate">DEL, Delhi Airport India</span>
              </div>

              {/* TO */}
              <div className="border border-sky/30 rounded-xl p-3 hover:bg-sky/5 cursor-text group transition-colors">
                <span className="text-[11px] font-bold text-rock uppercase tracking-wider block mb-1">To</span>
                <input 
                  type="text" 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full text-3xl font-black text-ocean bg-transparent border-none p-0 focus:ring-0 placeholder:text-rock/30 outline-none"
                />
                <span className="text-xs text-ocean/80 font-medium block mt-1 truncate">BOM, Chhatrapati Shivaji Int.</span>
              </div>

              {/* DEPARTURE */}
              <div className="border border-sky/30 rounded-xl p-3 hover:bg-sky/5 cursor-text group transition-colors relative">
                <span className="text-[11px] font-bold text-rock uppercase tracking-wider block mb-1 flex items-center gap-1">Departure <ChevronDown className="w-3 h-3" /></span>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="text-3xl font-black text-ocean">{date ? new Date(date).getDate() : 'Select'} <span className="text-xl font-bold text-ocean/80">{date ? new Date(date).toLocaleString('default', { month: 'short' }) : 'Date'}</span></div>
                <span className="text-xs text-ocean/80 font-medium block mt-1">{date ? new Date(date).toLocaleDateString('default', { weekday: 'long' }) : 'Any day'}</span>
              </div>

              {/* RETURN */}
              <div className={`border border-sky/30 rounded-xl p-3 transition-colors relative ${tripType === 'roundTrip' ? 'hover:bg-sky/5 cursor-text' : 'bg-rock/5 cursor-not-allowed opacity-60'}`}>
                <span className="text-[11px] font-bold text-rock uppercase tracking-wider block mb-1 flex items-center gap-1">Return <ChevronDown className="w-3 h-3" /></span>
                <input 
                  type="date" 
                  disabled={tripType !== 'roundTrip'}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                />
                <div className="text-3xl font-black text-ocean">{returnDate ? new Date(returnDate).getDate() : '--'} <span className="text-xl font-bold text-ocean/80">{returnDate ? new Date(returnDate).toLocaleString('default', { month: 'short' }) : ''}</span></div>
                <span className="text-xs text-ocean/80 font-medium block mt-1">{returnDate ? new Date(returnDate).toLocaleDateString('default', { weekday: 'long' }) : 'Tap to add a return date for bigger discounts'}</span>
              </div>

              {/* TRAVELLERS & CLASS */}
              <div className="border border-sky/30 rounded-xl p-3 hover:bg-sky/5 cursor-pointer group transition-colors relative" onClick={() => setShowTravelers(!showTravelers)}>
                <span className="text-[11px] font-bold text-rock uppercase tracking-wider block mb-1 flex items-center gap-1">Travellers & Class <ChevronDown className="w-3 h-3" /></span>
                <div className="text-3xl font-black text-ocean">{adults + children + infants} <span className="text-xl font-bold text-ocean/80">Traveller(s)</span></div>
                <span className="text-xs text-ocean/80 font-medium block mt-1 truncate">{travelClass}</span>

                {/* Popover */}
                <AnimatePresence>
                  {showTravelers && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-[110%] right-0 bg-white p-6 rounded-2xl shadow-2xl border border-sky/10 w-80 z-50 cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-ocean text-sm">Adults</p>
                            <p className="text-[10px] text-rock">12+ yrs</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full bg-cloud text-ocean font-black flex items-center justify-center hover:bg-sky">-</button>
                            <span className="font-black text-ocean w-4 text-center">{adults}</span>
                            <button onClick={() => setAdults(Math.min(9, adults + 1))} className="w-8 h-8 rounded-full bg-cloud text-ocean font-black flex items-center justify-center hover:bg-sky">+</button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-ocean text-sm">Children</p>
                            <p className="text-[10px] text-rock">2-12 yrs</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full bg-cloud text-ocean font-black flex items-center justify-center hover:bg-sky">-</button>
                            <span className="font-black text-ocean w-4 text-center">{children}</span>
                            <button onClick={() => setChildren(Math.min(9, children + 1))} className="w-8 h-8 rounded-full bg-cloud text-ocean font-black flex items-center justify-center hover:bg-sky">+</button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-ocean text-sm">Infants</p>
                            <p className="text-[10px] text-rock">Under 2 yrs</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setInfants(Math.max(0, infants - 1))} className="w-8 h-8 rounded-full bg-cloud text-ocean font-black flex items-center justify-center hover:bg-sky">-</button>
                            <span className="font-black text-ocean w-4 text-center">{infants}</span>
                            <button onClick={() => setInfants(Math.min(adults, infants + 1))} className="w-8 h-8 rounded-full bg-cloud text-ocean font-black flex items-center justify-center hover:bg-sky">+</button>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-sky/10">
                          <p className="font-bold text-ocean text-xs mb-3">Choose Travel Class</p>
                          <div className="flex flex-wrap gap-2">
                            {['Economy/Premium Economy', 'Premium Economy', 'Business'].map(cls => (
                              <button 
                                key={cls}
                                onClick={() => setTravelClass(cls)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${travelClass === cls ? 'bg-ocean text-white' : 'bg-cloud text-ocean hover:bg-sky'}`}
                              >
                                {cls}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setShowTravelers(false)} className="w-full mt-6 bg-sunset text-white font-black py-2 rounded-xl text-sm hover:bg-coral">Apply</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Special Fares */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-bold text-ocean">Select A Fare Type:</span>
              <div className="flex flex-wrap gap-3">
                {['Regular Fares', 'Armed Forces Fares', 'Student Fares', 'Senior Citizen Fares', 'Doctors & Nurses Fares'].map((fare, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer bg-cloud px-3 py-1.5 rounded-lg border border-transparent hover:border-sky/20">
                    <input type="radio" name="fare" defaultChecked={i === 0} className="accent-ocean" />
                    <span className="text-[11px] font-bold text-ocean">{fare}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Search Button (Floating) */}
            <button 
              onClick={handleSearch}
              className="absolute left-1/2 -bottom-6 -translate-x-1/2 bg-gradient-to-r from-tropical to-ocean hover:opacity-90 text-white font-black text-xl py-3 px-16 rounded-full shadow-2xl shadow-tropical/30 flex items-center gap-2 uppercase tracking-widest transition-transform hover:scale-105"
            >
              Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-sky/10 shadow-xl shadow-ocean/5 flex items-start gap-6 group"
            >
              <div className="w-14 h-14 bg-cloud rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-ocean group-hover:text-white transition-all text-ocean">
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-ocean mb-2">{f.title}</h3>
                <p className="text-sm text-rock leading-relaxed font-medium">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24 container mx-auto px-6">
        <div className="bg-gradient-to-r from-[#0a192f] to-[#112240] rounded-[3rem] p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="relative z-10 max-w-2xl text-white">
            <h2 className="text-4xl font-black mb-4">Download the Hawai App</h2>
            <p className="text-sky/80 font-medium mb-8">Get exclusive app-only deals and manage your bookings effortlessly on the go.</p>
            <div className="flex gap-4">
              <button className="bg-white text-ocean font-black py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-sky transition-colors">
                App Store
              </button>
              <button className="bg-white text-ocean font-black py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-sky transition-colors">
                Google Play
              </button>
            </div>
          </div>
          <Plane className="w-64 h-64 text-white/5 absolute right-12 top-1/2 -translate-y-1/2 -rotate-12" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;

