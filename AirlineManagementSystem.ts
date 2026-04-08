import { BookingManager } from "./BookingManager.ts";
import { FlightSearch } from "./FlightSearch.ts";
import { PaymentProcessor } from "./PaymentProcessor.ts";
import { Flight } from "./Flight.ts";
import { Aircraft } from "./Aircraft.ts";
import { Passenger } from "./Passenger.ts";
import { Seat } from "./Seat.ts";
import { Booking } from "./Booking.ts";
import { Payment } from "./Payment.ts";



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
        this.bookingManager = BookingManager.getInstance();
        this.paymentProcessor = PaymentProcessor.getInstance();
    }

    generateId() : string {
        return Math.random().toString(36).substr(2, 9);
    }

    addPassenger(name: string, email: string) : Passenger {
        const passenger = new Passenger(name, email);
        this.passengers.set(passenger.getId(), passenger);
        return passenger;
    } 
    removePassenger(id: string) : void {
        this.passengers.delete(id);
    }

    addAircraft(tailNumber: string, model: string, capacity: number) : Aircraft {
        const aircraft = new Aircraft(tailNumber, model, capacity);
        this.aircraft.set(aircraft.getTailNumber(), aircraft);
        return aircraft;
    }
    removeAircraft(id: string) : void {
        this.aircraft.delete(id);
    }

    addFlight(source: string, destination: string, departureTime: Date, arrivalTime: Date, aircraftNumber: string) : Flight {
        const aircraft = this.aircraft.get(aircraftNumber);
        if (!aircraft) throw new Error("Aircraft not found");
        const flight = new Flight(source, destination, departureTime, arrivalTime, aircraft);
        this.flights.set(flight.getFlightNumber(), flight);
        this.flightSearch.addFlight(flight);
        return flight;
    }
    removeFlight(id: string) : void {
        this.flights.delete(id);
    }

    searchFlights(source: string, destination: string, departureDate: Date): Flight[] {
        return this.flightSearch.searchFlights(source, destination, departureDate);
    }

    bookFlight(flightNumber: string, passengerId: string, seat: Seat, price: number) : Booking {
        const flight = this.flights.get(flightNumber);
        const passenger = this.passengers.get(passengerId);
        if (!flight || !passenger) throw new Error("Flight or Passenger not found");
        return this.bookingManager.createBooking(flight, passenger, seat, price);
    }

    cancelBooking(bookingNumber: string) : void {
        this.bookingManager.cancelBooking(bookingNumber);
    }

    processPayment(payment: Payment) : void {
        this.paymentProcessor.processPayment(payment);
    }

}