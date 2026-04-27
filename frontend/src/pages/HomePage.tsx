import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (source) params.append('source', source);
    if (destination) params.append('destination', destination);
    if (date) params.append('date', date);
    navigate(`/flights?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-white mb-3">✈️ Hawai Airlines</h1>
        <p className="text-xl text-blue-200">
          {isAuthenticated ? `Welcome back, ${user?.name}! Where to next?` : 'Your journey starts here'}
        </p>
      </div>

      {isAuthenticated ? (
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Search Flights</h2>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Origin</label>
                <input
                  type="text"
                  className="w-full py-3 px-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., New York"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Destination</label>
                <input
                  type="text"
                  className="w-full py-3 px-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Los Angeles"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                <input
                  type="date"
                  className="w-full py-3 px-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              Search Flights
            </button>
          </form>

          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => navigate('/flights')}
              className="text-indigo-600 hover:underline text-sm"
            >
              Browse All Flights
            </button>
            <button
              onClick={() => navigate('/my-bookings')}
              className="text-indigo-600 hover:underline text-sm"
            >
              View My Bookings
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <p className="text-lg text-gray-700 mb-6">Please login or sign up to continue.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
