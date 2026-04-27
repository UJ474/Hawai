import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          ✈️ Hawai Airlines
        </Link>
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <Link to="/flights" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Flights
              </Link>
              <Link to="/my-bookings" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                My Bookings
              </Link>
              <Link to="/profile" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                👤 {user?.name || 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link to="/signup" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-2">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
