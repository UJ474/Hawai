import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { flightService, Flight } from "../services/flightService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const FlightListPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD

  const fetchFlights = async () => {
    if (!isAuthenticated) {
      setError("Please log in to view flights.");
      setLoading(false);
      return;
    }

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
  }, [isAuthenticated]); // Refetch when auth status changes

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFlights();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Flights</h1>
        <p className="text-lg text-gray-600">Please log in to view available flights.</p>
        <Link to="/login" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Flights</h1>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="source" className="block text-gray-700 text-sm font-bold mb-2">
              Source:
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
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 self-end"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search Flights"}
          </button>
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
                  {flight.source} to {flight.destination}
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
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightListPage;
