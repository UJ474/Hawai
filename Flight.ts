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

    private generateFlightNumber(): string {
        return "FL-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    isSeatAvailable(seatNo: string) {
        const seat = this.seats.get(seatNo);
        return seat ? !seat.isBooked() : false;
    }
    reserveSeat(seatNo: string) {
        const seat = this.seats.get(seatNo);
        if (seat && !seat.isBooked()) {
            seat.reserve();
        }
    }
    releaseSeat(seatNo: string) {
        const seat = this.seats.get(seatNo);
        if (seat) {
            seat.release();
        }
    }

    getSource() : string { return this.source; }

    getDestination() : string { return this.destination; }

    getDepartureTime() : Date { return this.departureTime; }

    getArrivalTime() : Date { return this.arrivalTime; }

    getFlightNumber() : string { return this.flightNumber; }

    getAvailabeSeats() : Seat[] { return Array.from(this.seats.values()).filter(seat => !seat.isBooked()); }

}


enum FlightStatus {
    SCHEDULED,
    ON_TIME,
    DELAYED,
    CANCELLED
}