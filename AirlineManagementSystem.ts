import { BookingManager } from "./BookingManager.ts";
import { FlightSearch } from "./FlightSearch.ts";
import { PaymentProcessor } from "./PaymentProcessor.ts";
import { Flight } from "./Flight.ts";
import { Aircraft } from "./Aircraft.ts";
import { Passenger } from "./Passenger.ts";
import { Seat } from "./Seat.ts";
import { Booking } from "./Booking.ts";



class AirlineManagementSystem {
    readonly flights: Map<string, Flight>;
    readonly aircraft: Map<string, Aircraft>;
    readonly passengers: Map<string, Passenger>;
    readonly flightSearch: FlightSearch;
    readonly bookingManager: BookingManager;
    readonly paymentProcessor: PaymentProcessor;

    constructor() {
        this.flights = new Map<string, Flight>();
        this.aircraft = new Map<string, Aircraft>();
        this.passengers = new Map<string, Passenger>();
        this.flightSearch = new FlightSearch();
        this.bookingManager = new BookingManager();
        this.paymentProcessor = new PaymentProcessor();
    }

    generateId() : string {
        return Math.random().toString(36).substr(2, 9);
    }

    addPassenger(name: string, email: string) : Passenger {} 
    removePassenger(id: string) : void {}

    addAircraft(tailNumber: string, model: string, capacity: number) : Aircraft {}
    removeAircraft(id: string) : void {}

    addFlight(source: string, destination: string, departureTime: Date, arrivalTime: Date, aircraftNumber: string) : Flight {}
    removeFlight(id: string) : void {}

    searchFlights(source: string, destination: string, departureDate: Date): Flight[] {}

    bookFlight(flightNumber: string, passengerId: string, seat: Seat, price: number) : Booking {}

    cancelBooking(bookingNumber: string) : void {}

    processPayment(payment: Payment) : void {}

}