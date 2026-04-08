import { Flight } from "./Flight";

export class FlightSearch {
    private readonly flights: Map<string, Flight>;

    constructor() {
        this.flights = new Map<string, Flight>();
    }

    addFlight(flight: Flight) : void {
        this.flights.set(flight.getFlightNumber(), flight);
    }

    searchFlights(source: string, destination: string, date: Date) : Flight[] {
        return Array.from(this.flights.values()).filter(flight => 
            flight.getSource() === source && 
            flight.getDestination() === destination && 
            flight.getDepartureTime().toDateString() === date.toDateString()
        );
    }

}