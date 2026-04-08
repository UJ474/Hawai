export enum BookingStatus {
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  PENDING = "PENDING",
  EXPIRED = "EXPIRED",
}

import { Flight } from "./Flight.js";
import { Passenger } from "./Passenger.js";
import { Seat } from "./Seat.js";

export class Booking {
  private readonly id: string;
  private readonly flight: Flight;
  private readonly passenger: Passenger;
  private readonly seat: Seat;
  private readonly price: number;
  private status: BookingStatus;
  private readonly createdAt: Date;

  constructor(flight: Flight, passenger: Passenger, seat: Seat, price: number) {
    this.id = this.generateId();
    this.flight = flight;
    this.passenger = passenger;
    this.seat = seat;
    this.price = price;
    this.status = BookingStatus.PENDING;
    this.createdAt = new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  getId(): string           { return this.id; }
  getFlight(): Flight       { return this.flight; }
  getPassenger(): Passenger { return this.passenger; }
  getSeat(): Seat           { return this.seat; }
  getPrice(): number        { return this.price; }
  getStatus(): BookingStatus{ return this.status; }
  getCreatedAt(): Date      { return this.createdAt; }

  confirm(): void {
    this.status = BookingStatus.CONFIRMED;
  }

  cancel(): void {
    this.status = BookingStatus.CANCELED;
  }

  expire(): void {
    this.status = BookingStatus.EXPIRED;
  }
}
