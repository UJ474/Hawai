import { Flight } from "./Flight";
import { Passenger } from "./Passenger";
import { Seat } from "./Seat";

export class Booking {
    private readonly id : string;
    private readonly flight: Flight;
    private readonly passenger: Passenger;
    private readonly seat: Seat;
    private readonly price: number;
    status: BookingStatus;

    constructor(flight: Flight, passenger: Passenger, seat: Seat, price: number) {
        this.flight = flight;
        this.passenger = passenger;
        this.seat = seat;
        this.price = price;
        this.status = BookingStatus.PENDING;
    }

    generateId() : string {}

    cancel() : void {}
}


enum BookingStatus {
    CONFIRMED, 
    CANCELED,
    PENDING,
    EXPIRED
}