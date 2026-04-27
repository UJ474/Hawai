const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface Flight {
  flightId: string;
  source: string;
  destination: string;
  departureTime: string; // ISO date string
  arrivalTime: string; // ISO date string
  status: "ON_TIME" | "DELAYED" | "CANCELLED" | "SCHEDULED";
  aircraftId: string;
  seats?: Seat[]; // Populated on detail view
}

export interface Seat {
  seatId: string;
  seatNumber: string;
  seatType: "ECONOMY" | "BUSINESS" | "FIRST_CLASS";
  status: "AVAILABLE" | "BOOKED";
  flightId: string;
}

export const flightService = {
  async getFlights(
    source?: string,
    destination?: string,
    date?: string // YYYY-MM-DD
  ): Promise<Flight[]> {
    const params = new URLSearchParams();
    if (source) params.append("source", source);
    if (destination) params.append("destination", destination);
    if (date) params.append("date", date);

    const response = await fetch(`${API_BASE_URL}/flights?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch flights");
    }
    return response.json();
  },

  async getFlightById(id: string): Promise<Flight> {
    const response = await fetch(`${API_BASE_URL}/flights/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch flight details");
    }
    return response.json();
  },
};
