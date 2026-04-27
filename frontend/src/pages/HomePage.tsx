import React, { useState } from 'react';
import { Plane, Search, Calendar, MapPin, ArrowRight, Shield, Globe, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const features = [
    { icon: Shield, title: 'Safe Travel', desc: 'Verified airlines and secure payment processing for your peace of mind.' },
    { icon: Globe, title: 'Global Reach', desc: 'Over 500+ destinations worldwide at the most competitive prices.' },
    { icon: Clock, title: '24/7 Support', desc: 'Our dedicated team is always here to help you with your journey.' },
  ];

  return (
    <div className="min-h-screen bg-cloud">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Pattern/Image */}
        <div className="absolute inset-0 bg-ocean">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109c05d?auto=format&fit=crop&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-ocean/80 via-ocean/60 to-cloud" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight"
          >
            Escape to <span className="text-sky underline decoration-sunset decoration-4 underline-offset-8">Paradise</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-sky/90 mb-12 max-w-2xl mx-auto font-medium"
          >
            Experience the world's most beautiful destinations with Hawai. 
            Luxury travel, made accessible.
          </motion.p>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 md:p-8 rounded-[2.5rem] shadow-2xl shadow-ocean/20 max-w-5xl mx-auto border border-sky/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative text-left">
                <label className="block text-xs font-bold text-ocean uppercase tracking-widest mb-2 ml-4">From</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tropical" />
                  <input 
                    type="text" 
                    placeholder="Origin City"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full bg-cloud border-none rounded-2xl py-4 pl-12 pr-4 text-ocean font-bold placeholder:text-rock/40 focus:ring-2 focus:ring-tropical/20 transition-all"
                  />
                </div>
              </div>
              <div className="relative text-left">
                <label className="block text-xs font-bold text-ocean uppercase tracking-widest mb-2 ml-4">To</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tropical" />
                  <input 
                    type="text" 
                    placeholder="Destination City"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-cloud border-none rounded-2xl py-4 pl-12 pr-4 text-ocean font-bold placeholder:text-rock/40 focus:ring-2 focus:ring-tropical/20 transition-all"
                  />
                </div>
              </div>
              <div className="relative text-left">
                <label className="block text-xs font-bold text-ocean uppercase tracking-widest mb-2 ml-4">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tropical" />
                  <input 
                    type="date" 
                    className="w-full bg-cloud border-none rounded-2xl py-4 pl-12 pr-4 text-ocean font-bold focus:ring-2 focus:ring-tropical/20 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-sunset hover:bg-coral text-white font-extrabold py-4 px-8 rounded-2xl shadow-lg shadow-sunset/30 transition-all flex items-center justify-center gap-3 group">
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Find Flights
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean mb-4">Why choose Hawai?</h2>
          <div className="w-20 h-1.5 bg-sunset mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[2rem] border border-sky/5 shadow-xl shadow-ocean/5 hover:shadow-2xl hover:shadow-ocean/10 transition-all group"
            >
              <div className="w-16 h-16 bg-tropical/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-tropical group-hover:text-white transition-all">
                <f.icon className="w-8 h-8 text-tropical group-hover:text-white transition-all" />
              </div>
              <h3 className="text-xl font-bold text-ocean mb-3">{f.title}</h3>
              <p className="text-rock leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-ocean relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tropical/20 blur-[100px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple/20 blur-[100px] rounded-full -ml-48 -mb-48" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-12 rounded-[3rem] text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready for your next adventure?</h2>
            <p className="text-sky/80 text-lg mb-10 max-w-xl mx-auto font-medium">
              Join thousands of happy travelers who trust Hawai for their global explorations.
            </p>
            <button className="bg-white text-ocean hover:bg-sky font-extrabold py-4 px-12 rounded-full transition-all flex items-center justify-center gap-3 mx-auto shadow-xl">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
