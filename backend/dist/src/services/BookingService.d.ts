import { Booking } from "../models/index.js";
export declare class BookingService {
    private static instance;
    private constructor();
    static getInstance(): BookingService;
    private mapRecord;
    /**
     * Create a new booking (route-facing alias with flat args).
     * passengerId here is the DB id of an existing passenger.
     */
    create(flightId: string, passengerId: string, seatId: string, _price: number): Promise<Booking>;
    /** Return all bookings. */
    findAll(): Promise<Booking[]>;
    /** Find a single booking by its ID. */
    findById(id: string): Promise<Booking | null>;
    /** Find all bookings for a specific passenger. */
    findByPassengerId(passengerId: string): Promise<Booking[]>;
    /** Cancel a booking and free its seat. */
    cancel(bookingId: string): Promise<Booking>;
    /** Permanently delete a booking record. */
    delete(id: string): Promise<void>;
    /** @deprecated Use create() instead. */
    createBooking(flightId: string, passengerId: string, seatId: string): Promise<Booking>;
    /** @deprecated Use cancel() instead. */
    cancelBooking(bookingId: string): Promise<void>;
}
export declare const bookingService: BookingService;
//# sourceMappingURL=BookingService.d.ts.map