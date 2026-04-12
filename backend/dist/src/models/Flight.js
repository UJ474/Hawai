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
        return this.seats.filter((seat) => seat.status === 'AVAILABLE'); // Assuming SeatStatus.AVAILABLE
    }
    reserveSeat(seatNumber) {
        const seat = this.seats.find((s) => s.seatNumber === seatNumber);
        if (seat && seat.status === 'AVAILABLE') {
            seat.book();
            return true;
        }
        return false;
    }
    releaseSeat(seatNumber) {
        const seat = this.seats.find((s) => s.seatNumber === seatNumber);
        if (seat) {
            seat.release();
        }
    }
    // Getters for properties mapped to DB by Prisma
    getFlightId() { return this.flightId; }
    getSource() { return this.source; }
    getDestination() { return this.destination; }
    getDepartureTime() { return this.departureTime; }
    getArrivalTime() { return this.arrivalTime; }
    getStatus() { return this.status; }
    getSeats() { return this.seats; }
}
//# sourceMappingURL=Flight.js.map