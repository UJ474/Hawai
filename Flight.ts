import { Aircraft } from "./Aircraft";
import { Seat } from "./Seat";

export class Flight {
    private readonly flightNumber: string;
    private readonly source: string;
    private readonly destination: string;
    private readonly departureTime: Date;
    private readonly arrivalTime: Date;
    private readonly status: FlightStatus;
    private readonly aircraft: Aircraft;
    private readonly seats: Map<string, Seat>;
    private readonly availableSeats: Seat[];

    constructor(source: string, destination: string, departureTime: Date, arrivalTime: Date, aircraft: Aircraft) {
        this.flightNumber = this.generateFlightNumber();
        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.status = FlightStatus.SCHEDULED;
        this.aircraft = aircraft;
        this.seats = new Map<string, Seat>();
        this.availableSeats = [];
    }

    private generateFlightNumber(): string {}

    static isSeatAvailable(seatNo: string) {}
    static reserveSeat(seatNo: string) {}
    static releaseSeat(seatNo: string) {}

    getSource() : string {}

    getDestination() : string {}

    getDepartureTime() : Date {}

    getArrivalTime() : Date {}

    getFlightNumber() : string {}

    getAvailabeSeats() : Seat[] {}
    

}


enum FlightStatus {
    ON_TIME,
    DELAYED,
    CANCELLED
}