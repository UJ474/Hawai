import { Booking } from "../models/Booking.js";
import { Passenger } from "../models/Passenger.js";
import { Flight } from "../models/Flight.js";
import { Seat } from "../models/Seat.js";

export class BookingManager {
  private static instance: BookingManager;
  private readonly bookings: Map<string, Booking>;

  private constructor() {
    this.bookings = new Map<string, Booking>();
  }

  static getInstance(): BookingManager {
    if (!BookingManager.instance) {
      BookingManager.instance = new BookingManager();
    }
    return BookingManager.instance;
  }

  createBooking(
    flight: Flight,
    passenger: Passenger,
    seat: Seat,
    price: number
  ): Booking {
    if (!flight.isSeatAvailable(seat.getSeatNumber())) {
      throw new Error(`Seat ${seat.getSeatNumber()} is not available`);
    }
    const booking = new Booking(flight, passenger, seat, price);
    flight.reserveSeat(seat.getSeatNumber());
    booking.confirm();
    this.bookings.set(booking.getId(), booking);
    return booking;
  }

  cancelBooking(bookingId: string): void {
    const booking = this.bookings.get(bookingId);
    if (!booking) throw new Error(`Booking ${bookingId} not found`);
    booking.cancel();
    booking.getFlight().releaseSeat(booking.getSeat().getSeatNumber());
  }

  getBooking(bookingId: string): Booking | undefined {
    return this.bookings.get(bookingId);
  }

  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  getBookingsByPassenger(passengerId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(
      (b) => b.getPassenger().getId() === passengerId
    );
  }
}
