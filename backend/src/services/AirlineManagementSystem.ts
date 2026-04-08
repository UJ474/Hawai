import { BookingManager } from "./BookingManager.js";
import { FlightSearch } from "./FlightSearch.js";
import { PaymentProcessor } from "./PaymentProcessor.js";
import { Flight } from "../models/Flight.js";
import { Aircraft } from "../models/Aircraft.js";
import { Passenger } from "../models/Passenger.js";
import { Seat, SeatType } from "../models/Seat.js";
import { Booking } from "../models/Booking.js";
import { Payment, PaymentMethod } from "../models/Payment.js";

export class AirlineManagementSystem {
  private readonly flights: Map<string, Flight>;
  private readonly aircraft: Map<string, Aircraft>;
  private readonly passengers: Map<string, Passenger>;
  private readonly flightSearch: FlightSearch;
  private readonly bookingManager: BookingManager;
  private readonly paymentProcessor: PaymentProcessor;

  constructor() {
    this.flights = new Map<string, Flight>();
    this.aircraft = new Map<string, Aircraft>();
    this.passengers = new Map<string, Passenger>();
    this.flightSearch = new FlightSearch();
    this.bookingManager = BookingManager.getInstance();
    this.paymentProcessor = PaymentProcessor.getInstance();
  }

  // ── Passengers ────────────────────────────────────────────────────

  addPassenger(name: string, email: string): Passenger {
    const passenger = new Passenger(name, email);
    this.passengers.set(passenger.getId(), passenger);
    return passenger;
  }

  getPassenger(id: string): Passenger | undefined {
    return this.passengers.get(id);
  }

  getAllPassengers(): Passenger[] {
    return Array.from(this.passengers.values());
  }

  removePassenger(id: string): void {
    this.passengers.delete(id);
  }

  // ── Aircraft ──────────────────────────────────────────────────────

  addAircraft(tailNumber: string, model: string, capacity: number): Aircraft {
    const aircraft = new Aircraft(tailNumber, model, capacity);
    this.aircraft.set(aircraft.getTailNumber(), aircraft);
    return aircraft;
  }

  getAircraft(tailNumber: string): Aircraft | undefined {
    return this.aircraft.get(tailNumber);
  }

  getAllAircraft(): Aircraft[] {
    return Array.from(this.aircraft.values());
  }

  removeAircraft(tailNumber: string): void {
    this.aircraft.delete(tailNumber);
  }

  // ── Flights ───────────────────────────────────────────────────────

  addFlight(
    source: string,
    destination: string,
    departureTime: Date,
    arrivalTime: Date,
    aircraftTailNumber: string
  ): Flight {
    const aircraft = this.aircraft.get(aircraftTailNumber);
    if (!aircraft) throw new Error(`Aircraft ${aircraftTailNumber} not found`);

    const flight = new Flight(source, destination, departureTime, arrivalTime, aircraft);

    const capacity = aircraft.getCapacity();
    for (let i = 1; i <= capacity; i++) {
      const ratio = i / capacity;
      let seatType: SeatType;
      if (ratio <= 0.05)       seatType = SeatType.FIRST_CLASS;
      else if (ratio <= 0.15)  seatType = SeatType.BUSINESS;
      else if (ratio <= 0.25)  seatType = SeatType.PREMIUM_ECONOMY;
      else                     seatType = SeatType.ECONOMY;

      const row = Math.ceil(i / 6);
      const col = String.fromCharCode(64 + ((i - 1) % 6) + 1); // A–F
      flight.addSeat(new Seat(`${row}${col}`, seatType));
    }

    this.flights.set(flight.getFlightNumber(), flight);
    this.flightSearch.addFlight(flight);
    return flight;
  }

  getFlight(flightNumber: string): Flight | undefined {
    return this.flights.get(flightNumber);
  }

  getAllFlights(): Flight[] {
    return Array.from(this.flights.values());
  }

  removeFlight(flightNumber: string): void {
    this.flights.delete(flightNumber);
    this.flightSearch.removeFlight(flightNumber);
  }

  searchFlights(source: string, destination: string, departureDate: Date): Flight[] {
    return this.flightSearch.searchFlights(source, destination, departureDate);
  }


  bookFlight(
    flightNumber: string,
    passengerId: string,
    seatNumber: string,
    price: number
  ): Booking {
    const flight = this.flights.get(flightNumber);
    const passenger = this.passengers.get(passengerId);
    if (!flight)     throw new Error(`Flight ${flightNumber} not found`);
    if (!passenger)  throw new Error(`Passenger ${passengerId} not found`);

    const seat = flight.getAvailableSeats().find(
      (s) => s.getSeatNumber() === seatNumber
    );
    if (!seat) throw new Error(`Seat ${seatNumber} is not available`);

    return this.bookingManager.createBooking(flight, passenger, seat, price);
  }

  cancelBooking(bookingId: string): void {
    this.bookingManager.cancelBooking(bookingId);
  }

  getBooking(bookingId: string): Booking | undefined {
    return this.bookingManager.getBooking(bookingId);
  }

  getBookingsByPassenger(passengerId: string): Booking[] {
    return this.bookingManager.getBookingsByPassenger(passengerId);
  }

  processPayment(
    bookingId: string,
    method: PaymentMethod,
    amount: number
  ): Payment {
    const paymentId = Math.random().toString(36).substring(2, 11).toUpperCase();
    const payment = new Payment(paymentId, method, amount, bookingId);
    const success = this.paymentProcessor.processPayment(payment);
    if (!success) throw new Error("Payment processing failed");
    return payment;
  }

  refundPayment(payment: Payment): boolean {
    return this.paymentProcessor.refundPayment(payment);
  }
}
