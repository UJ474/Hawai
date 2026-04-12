export declare enum BookingStatus {
    CONFIRMED = "CONFIRMED",
    CANCELED = "CANCELED",
    PENDING = "PENDING",
    EXPIRED = "EXPIRED"
}
export declare class Booking {
    private bookingId;
    private flightId;
    private passengerId;
    private seatId;
    private status;
    constructor(bookingId: string, flightId: string, passengerId: string, seatId: string, status: BookingStatus);
    confirmBooking(): void;
    cancelBooking(): void;
    getBookingId(): string;
    getFlightId(): string;
    getPassengerId(): string;
    getSeatId(): string;
    getStatus(): BookingStatus;
}
//# sourceMappingURL=Booking.d.ts.map