import { SeatStatus } from "./Seat.js";
export var FlightStatus;
(function (FlightStatus) {
    FlightStatus["ON_TIME"] = "ON_TIME";
    FlightStatus["DELAYED"] = "DELAYED";
    FlightStatus["CANCELLED"] = "CANCELLED";
})(FlightStatus || (FlightStatus = {}));
export class Flight {
    flightId;
    source;
    destination;
    departureTime;
    arrivalTime;
    status;
    seats;
    constructor(flightId, source, destination, departureTime, arrivalTime, status, seats = []) {
        this.flightId = flightId;
        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.status = status;
        this.seats = seats;
    }
    getAvailableSeats() {
        return this.seats.filter((seat) => seat.getStatus() === SeatStatus.AVAILABLE);
    }
    reserveSeat(seatNumber) {
        const seat = this.seats.find((s) => s.getSeatNumber() === seatNumber);
        if (seat && seat.getStatus() === SeatStatus.AVAILABLE) {
            seat.book();
            return true;
        }
        return false;
    }
    releaseSeat(seatNumber) {
        const seat = this.seats.find((s) => s.getSeatNumber() === seatNumber);
        if (seat) {
            seat.release();
        }
    }
    getFlightId() { return this.flightId; }
    getSource() { return this.source; }
    getDestination() { return this.destination; }
    getDepartureTime() { return this.departureTime; }
    getArrivalTime() { return this.arrivalTime; }
    getStatus() { return this.status; }
    getSeats() { return this.seats; }
}
//# sourceMappingURL=Flight.js.map