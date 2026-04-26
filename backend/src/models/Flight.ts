import { Seat, SeatStatus } from "./Seat.js";

export enum FlightStatus {
  ON_TIME = "ON_TIME",
  DELAYED = "DELAYED",
  CANCELLED = "CANCELLED",
}

export class Flight {
  private flightId: string;
  private source: string;
  private destination: string;
  private departureTime: Date;
  private arrivalTime: Date;
  private status: FlightStatus;
  private seats: Seat[];

  constructor(
    flightId: string,
    source: string,
    destination: string,
    departureTime: Date,
    arrivalTime: Date,
    status: FlightStatus,
    seats: Seat[] = []
  ) {
    this.flightId = flightId;
    this.source = source;
    this.destination = destination;
    this.departureTime = departureTime;
    this.arrivalTime = arrivalTime;
    this.status = status;
    this.seats = seats;
  }

  public getAvailableSeats(): Seat[] {
    return this.seats.filter((seat) => seat.getStatus() === SeatStatus.AVAILABLE);
  }

  public reserveSeat(seatNumber: string): boolean {
    const seat = this.seats.find((s) => s.getSeatNumber() === seatNumber);
    if (seat && seat.getStatus() === SeatStatus.AVAILABLE) {
      seat.book();
      return true;
    }
    return false;
  }

  public releaseSeat(seatNumber: string): void {
    const seat = this.seats.find((s) => s.getSeatNumber() === seatNumber);
    if (seat) {
      seat.release();
    }
  }

  public getFlightId(): string { return this.flightId; }
  public getSource(): string { return this.source; }
  public getDestination(): string { return this.destination; }
  public getDepartureTime(): Date { return this.departureTime; }
  public getArrivalTime(): Date { return this.arrivalTime; }
  public getStatus(): FlightStatus { return this.status; }
  public getSeats(): Seat[] { return this.seats; }
}
