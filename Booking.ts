import { Flight } from "./Flight";
import { Passenger } from "./Passenger";
import { Seat } from "./Seat";

export class Booking {
    private readonly id: string;
    private readonly flight: Flight;
    private readonly passenger: Passenger;
    private readonly seat: Seat;
    private readonly price: number;
    status: BookingStatus;

    constructor(flight: Flight, passenger: Passenger, seat: Seat, price: number) {
        this.id = this.generateId();
        this.flight = flight;
        this.passenger = passenger;
        this.seat = seat;
        this.price = price;
        this.status = BookingStatus.PENDING;
    }

    generateId(): string {
        // Generate a random string as ID
        return Math.random().toString(36).substring(2, 15);
    }

    getId(): string {
        return this.id;
    }

    cancel(): void {
        this.status = BookingStatus.CANCELED;
    }
}


enum BookingStatus {
    CONFIRMED,
    CANCELED,
    PENDING,
    EXPIRED
}