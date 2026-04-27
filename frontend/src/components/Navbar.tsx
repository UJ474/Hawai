import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plane, 
  User as UserIcon, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X, 
  Briefcase, 
  Hotel, 
  Globe,
  Bell,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Flights', path: '/flights', icon: Plane },
    { name: 'Hotels', path: '/hotels', icon: Hotel },
    { name: 'My Bookings', path: '/my-bookings', icon: Briefcase },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-ocean/90 backdrop-blur-xl py-3 shadow-2xl' : 'bg-ocean py-5'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-tropical to-aqua rounded-2xl flex items-center justify-center shadow-lg shadow-tropical/30 group-hover:rotate-12 transition-all duration-300">
              <Plane className="text-white w-7 h-7 -rotate-45" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black tracking-tighter text-white">HAWAI</span>
              <span className="text-[10px] font-bold text-sky tracking-[0.3em] uppercase">Airways</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {isAuthenticated && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-6 py-2 rounded-xl text-sm font-bold transition-all group ${
                  isActive(link.path) ? 'text-white' : 'text-sky/60 hover:text-white'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <link.icon className={`w-4 h-4 ${isActive(link.path) ? 'text-sunset' : 'group-hover:text-sunset'} transition-colors`} />
                  {link.name}
                </span>
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sky/60 hover:text-white transition-all">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-1.5 pr-4 rounded-2xl transition-all border border-white/10 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-sunset to-coral rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-sunset/20 group-hover:scale-105 transition-all">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-[10px] font-black text-sky/40 uppercase tracking-widest leading-none mb-1">Explorer</p>
                      <p className="text-sm font-bold text-white leading-none">{user?.name || 'Account'}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-sky/40 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] py-3 border border-sky/10 overflow-hidden"
                      >
                        <div className="px-6 py-6 border-b border-sky/5 bg-cloud/30">
                          <p className="text-[10px] font-black text-rock/40 uppercase tracking-widest mb-2">Member Account</p>
                          <p className="text-lg font-black text-ocean truncate leading-none mb-1">{user?.name}</p>
                          <p className="text-xs font-bold text-rock/60 truncate">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-4 px-6 py-4 text-sm font-bold text-ocean hover:bg-cloud rounded-2xl transition-all group"
                          >
                            <div className="w-10 h-10 bg-tropical/10 rounded-xl flex items-center justify-center group-hover:bg-tropical group-hover:text-white transition-all">
                              <UserIcon className="w-5 h-5" />
                            </div>
                            My Profile
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-4 px-6 py-4 text-sm font-bold text-ocean hover:bg-cloud rounded-2xl transition-all group"
                          >
                            <div className="w-10 h-10 bg-ocean/5 rounded-xl flex items-center justify-center group-hover:bg-ocean group-hover:text-white transition-all">
                              <Settings className="w-5 h-5" />
                            </div>
                            Preferences
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold text-coral hover:bg-coral/5 rounded-2xl transition-all group mt-2"
                          >
                            <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center group-hover:bg-coral group-hover:text-white transition-all">
                              <LogOut className="w-5 h-5" />
                            </div>
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <Link
                  to="/login"
                  className="text-sm font-bold text-sky/60 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-sunset hover:bg-coral text-white px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-sunset/20 hover:-translate-y-0.5"
                >
                  Join Hawai
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 top-[72px] bg-ocean z-40 lg:hidden"
          >
            <div className="p-8 space-y-6">
              {isAuthenticated ? (
                <>
                  <div className="p-6 bg-white/5 rounded-3xl mb-8">
                    <p className="text-[10px] font-black text-sky/40 uppercase tracking-widest mb-2">Logged in as</p>
                    <p className="text-xl font-black text-white">{user?.name}</p>
                  </div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 text-xl font-bold text-white py-4 border-b border-white/5"
                    >
                      <link.icon className="w-6 h-6 text-tropical" />
                      {link.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 text-xl font-bold text-coral py-4 w-full text-left"
                  >
                    <LogOut className="w-6 h-6" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-6 pt-10">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-5 font-black text-white text-xl border-2 border-white/10 rounded-3xl"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-5 font-black text-white text-xl bg-sunset rounded-3xl shadow-2xl shadow-sunset/20"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
