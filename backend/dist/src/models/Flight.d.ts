import { Seat } from "./Seat.js";
export declare enum FlightStatus {
    ON_TIME = "ON_TIME",
    DELAYED = "DELAYED",
    CANCELLED = "CANCELLED"
}
export declare class Flight {
    private flightId;
    private source;
    private destination;
    private departureTime;
    private arrivalTime;
    private status;
    private seats;
    constructor(flightId: string, source: string, destination: string, departureTime: Date, arrivalTime: Date, status: FlightStatus, seats?: Seat[]);
    getAvailableSeats(): Seat[];
    reserveSeat(seatNumber: string): boolean;
    releaseSeat(seatNumber: string): void;
    getFlightId(): string;
    getSource(): string;
    getDestination(): string;
    getDepartureTime(): Date;
    getArrivalTime(): Date;
    getStatus(): FlightStatus;
    getSeats(): Seat[];
}
//# sourceMappingURL=Flight.d.ts.map