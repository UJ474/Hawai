import { Flight } from "../models/Flight.js";

export class FlightSearch {
  private readonly flights: Map<string, Flight>;

  constructor() {
    this.flights = new Map<string, Flight>();
  }

  addFlight(flight: Flight): void {
    this.flights.set(flight.getFlightNumber(), flight);
  }

  removeFlight(flightNumber: string): void {
    this.flights.delete(flightNumber);
  }

  searchFlights(source: string, destination: string, date: Date): Flight[] {
    return Array.from(this.flights.values()).filter(
      (f) =>
        f.getSource().toLowerCase() === source.toLowerCase() &&
        f.getDestination().toLowerCase() === destination.toLowerCase() &&
        f.getDepartureTime().toDateString() === date.toDateString()
    );
  }

  getFlightByNumber(flightNumber: string): Flight | undefined {
    return this.flights.get(flightNumber);
  }

  getAllFlights(): Flight[] {
    return Array.from(this.flights.values());
  }
}
