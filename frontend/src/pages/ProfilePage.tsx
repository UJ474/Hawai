import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  CreditCard, 
  MapPin, 
  Bell, 
  Lock,
  ChevronRight,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const settings = [
    { icon: User, title: 'Personal Information', desc: 'Update your name, email, and contact details' },
    { icon: Lock, title: 'Login & Security', desc: 'Manage your password and security settings' },
    { icon: CreditCard, title: 'Payment Methods', desc: 'Save cards and UPI IDs for faster checkout' },
    { icon: Bell, title: 'Notifications', desc: 'Configure how you want to be notified' },
  ];

  return (
    <div className="min-h-screen bg-cloud pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-4xl font-black text-ocean">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-sky/10 text-center sticky top-32">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full bg-gradient-to-br from-sunset to-coral rounded-full flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-sunset/20">
                  {user?.name?.[0] || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-ocean text-white rounded-full flex items-center justify-center border-4 border-white hover:scale-110 transition-transform shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-2xl font-black text-ocean mb-1">{user?.name}</h2>
              <p className="text-sm font-bold text-rock mb-6">{user?.email}</p>
              
              <div className="flex items-center justify-center gap-2 bg-cloud py-2 px-4 rounded-xl mb-8">
                <Shield className="w-4 h-4 text-jungle" />
                <span className="text-[10px] font-black text-ocean uppercase tracking-widest">Verified Member</span>
              </div>

              <div className="space-y-4 pt-4 border-t border-sky/5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-rock uppercase">Total Trips</span>
                  <span className="text-ocean">12</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-rock uppercase">Member Since</span>
                  <span className="text-ocean">Oct 2023</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings List */}
          <div className="lg:col-span-2 space-y-4">
            {settings.map((item, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="w-full bg-white p-6 rounded-3xl border border-sky/5 shadow-xl shadow-ocean/5 flex items-center justify-between group hover:border-tropical/30 hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-cloud rounded-2xl flex items-center justify-center text-tropical group-hover:bg-tropical group-hover:text-white transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-ocean text-lg">{item.title}</h3>
                    <p className="text-sm font-medium text-rock">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-rock/30 group-hover:text-tropical group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
            
            <div className="mt-12 p-8 bg-gradient-to-br from-ocean to-tropical rounded-[2.5rem] text-white shadow-2xl shadow-ocean/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2">Hawai Rewards</h3>
                <p className="text-sky/80 text-sm font-medium mb-6">You have 2,450 points available. Use them to get discounts on your next flight!</p>
                <button className="bg-sunset hover:bg-coral text-white font-black py-3 px-8 rounded-xl transition-all shadow-lg shadow-sunset/20">
                  Redeem Points
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
