export var SeatType;
(function (SeatType) {
    SeatType["ECONOMY"] = "ECONOMY";
    SeatType["BUSINESS"] = "BUSINESS";
    SeatType["FIRST_CLASS"] = "FIRST_CLASS";
})(SeatType || (SeatType = {}));
export var SeatStatus;
(function (SeatStatus) {
    SeatStatus["AVAILABLE"] = "AVAILABLE";
    SeatStatus["BOOKED"] = "BOOKED";
})(SeatStatus || (SeatStatus = {}));
export class Seat {
    seatId;
    seatNumber;
    seatType;
    status;
    flightId;
    constructor(seatId, seatNumber, seatType, flightId, status = SeatStatus.AVAILABLE) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.flightId = flightId;
        this.status = status;
    }
    book() {
        if (this.status === SeatStatus.AVAILABLE) {
            this.status = SeatStatus.BOOKED;
        }
    }
    release() {
        if (this.status === SeatStatus.BOOKED) {
            this.status = SeatStatus.AVAILABLE;
        }
    }
    getSeatId() { return this.seatId; }
    getSeatNumber() { return this.seatNumber; }
    getSeatType() { return this.seatType; }
    getStatus() { return this.status; }
    getFlightId() { return this.flightId; }
}
//# sourceMappingURL=Seat.js.map