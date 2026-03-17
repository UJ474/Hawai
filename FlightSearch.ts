import { Flight } from "./Flights";

export class FlightSearch {
    private readonly flights: Map<string, Flight>;

    constructor() {
        this.flights = new Map<string, Flight>();
    }

    addFlight(flight: Flight) : void {}

    searchFlights(source: string, destination: string, date: Date) : Flight[] {}

}