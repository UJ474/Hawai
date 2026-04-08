export enum FlightStatus {
  SCHEDULED = "SCHEDULED",
  ON_TIME = "ON_TIME",
  DELAYED = "DELAYED",
  CANCELLED = "CANCELLED",
}

import { Aircraft } from "./Aircraft.js";
import { Seat } from "./Seat.js";

export class Flight {
  private readonly flightNumber: string;
  private readonly source: string;
  private readonly destination: string;
  private readonly departureTime: Date;
  private readonly arrivalTime: Date;
  private status: FlightStatus;
  private readonly aircraft: Aircraft;
  private readonly seats: Map<string, Seat>;

  constructor(
    source: string,
    destination: string,
    departureTime: Date,
    arrivalTime: Date,
    aircraft: Aircraft
  ) {
    this.flightNumber = this.generateFlightNumber();
    this.source = source;
    this.destination = destination;
    this.departureTime = departureTime;
    this.arrivalTime = arrivalTime;
    this.status = FlightStatus.SCHEDULED;
    this.aircraft = aircraft;
    this.seats = new Map<string, Seat>();
  }

  private generateFlightNumber(): string {
    return "FL-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  addSeat(seat: Seat): void {
    this.seats.set(seat.getSeatNumber(), seat);
  }

  isSeatAvailable(seatNo: string): boolean {
    const seat = this.seats.get(seatNo);
    return seat ? !seat.isBooked() : false;
  }

  reserveSeat(seatNo: string): void {
    const seat = this.seats.get(seatNo);
    if (seat && !seat.isBooked()) seat.reserve();
  }

  releaseSeat(seatNo: string): void {
    const seat = this.seats.get(seatNo);
    if (seat) seat.release();
  }

  updateStatus(status: FlightStatus): void {
    this.status = status;
  }

  getFlightNumber(): string { return this.flightNumber; }
  getSource(): string       { return this.source; }
  getDestination(): string  { return this.destination; }
  getDepartureTime(): Date  { return this.departureTime; }
  getArrivalTime(): Date    { return this.arrivalTime; }
  getStatus(): FlightStatus { return this.status; }
  getAircraft(): Aircraft   { return this.aircraft; }

  getAvailableSeats(): Seat[] {
    return Array.from(this.seats.values()).filter((s) => !s.isBooked());
  }

  getAllSeats(): Seat[] {
    return Array.from(this.seats.values());
  }
}
