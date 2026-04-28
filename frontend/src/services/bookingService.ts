const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface Booking {
  bookingId: string;
  flightId: string;
  passengerId: string;
  seatId: string;
  price: number;
  status: "CONFIRMED" | "CANCELED" | "PENDING" | "EXPIRED";
  createdAt?: string;
  flight?: {
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    flightNumber: string;
    status: string;
  };
  seat?: {
    seatNumber: string;
    seatType: string;
  };
  payment?: {
    paymentId: string;
    amount: number;
    method: string;
    status: string;
  } | null;
}

export const bookingService = {
  async createBooking(
    flightId: string,
    passengerId: string,
    seatNumber: string,
    price: number
  ): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ flightId, passengerId, seatNumber, price }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create booking");
    }
    return response.json();
  },

  async createManyBookings(
    flightId: string,
    passengerId: string,
    seats: { seatNumber: string; price: number }[]
  ): Promise<Booking[]> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ flightId, passengerId, seats }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create bookings");
    }
    return response.json();
  },

  async getBookingById(id: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch booking details");
    }
    return response.json();
  },

  async getBookingsByPassengerId(passengerId: string): Promise<Booking[]> {
    const response = await fetch(`${API_BASE_URL}/bookings/passenger/${passengerId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch passenger bookings");
    }
    return response.json();
  },

  async cancelBooking(id: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to cancel booking");
    }
    return response.json();
  },
};
