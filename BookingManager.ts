import { Booking } from "./Booking.ts"
import { Passenger } from "./Passenger.ts";
import { Flight } from "./Flight.ts";
import { Seat } from "./Seat.ts";

export class BookingManager {
    private static instance: BookingManager;
    private readonly bookings: Map<string, Booking>;

    private constructor() {
        this.bookings = new Map<string, Booking>();
    }

    public static getInstance() : BookingManager {
        if (!this.instance) {
            this.instance = new BookingManager();
        }
        return this.instance;
    }

    createBooking(flight: Flight, passenger: Passenger, seat: Seat, price: number) : Booking {}

    cancelBooking(bookingNumber: string) : void {}

}