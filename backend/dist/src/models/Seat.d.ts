export declare enum SeatType {
    ECONOMY = "ECONOMY",
    BUSINESS = "BUSINESS",
    FIRST_CLASS = "FIRST_CLASS"
}
export declare enum SeatStatus {
    AVAILABLE = "AVAILABLE",
    BOOKED = "BOOKED"
}
export declare class Seat {
    private seatId;
    private seatNumber;
    private seatType;
    private status;
    private flightId;
    constructor(seatId: string, seatNumber: string, seatType: SeatType, flightId: string, status?: SeatStatus);
    book(): void;
    release(): void;
    getSeatId(): string;
    getSeatNumber(): string;
    getSeatType(): SeatType;
    getStatus(): SeatStatus;
    getFlightId(): string;
}
//# sourceMappingURL=Seat.d.ts.map