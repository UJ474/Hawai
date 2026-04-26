export var BookingStatus;
(function (BookingStatus) {
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CANCELED"] = "CANCELED";
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["EXPIRED"] = "EXPIRED";
})(BookingStatus || (BookingStatus = {}));
export class Booking {
    bookingId;
    flightId;
    passengerId;
    seatId;
    status;
    constructor(bookingId, flightId, passengerId, seatId, status) {
        this.bookingId = bookingId;
        this.flightId = flightId;
        this.passengerId = passengerId;
        this.seatId = seatId;
        this.status = status;
    }
    confirmBooking() {
        this.status = BookingStatus.CONFIRMED;
    }
    cancelBooking() {
        this.status = BookingStatus.CANCELED;
    }
    getBookingId() { return this.bookingId; }
    getFlightId() { return this.flightId; }
    getPassengerId() { return this.passengerId; }
    getSeatId() { return this.seatId; }
    getStatus() { return this.status; }
}
//# sourceMappingURL=Booking.js.map