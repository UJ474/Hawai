import { prisma } from "../db.js";
import { Booking, BookingStatus } from "../models/index.js";
export class BookingService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!BookingService.instance) {
            BookingService.instance = new BookingService();
        }
        return BookingService.instance;
    }
    // ── Helpers ────────────────────────────────────────────────────────────────
    mapRecord(record) {
        return new Booking(record.id, record.flightId, record.passengerId, record.seatId, record.status);
    }
    // ── Public API (used by routes) ────────────────────────────────────────────
    /**
     * Create a new booking (route-facing alias with flat args).
     * seatId here can be either the DB UUID or the human-readable seatNumber.
     * We resolve it to the actual seat record before proceeding.
     */
    async create(flightId, passengerId, seatId, _price // kept for schema compatibility, stored on DB record
    ) {
        return await prisma.$transaction(async (tx) => {
            // Resolve seat — accept either a UUID (id) or a seatNumber string
            let seatRecord = await tx.seat.findUnique({ where: { id: seatId } });
            if (!seatRecord) {
                // Try resolving by (flightId, seatNumber) for human-readable seat labels
                seatRecord = await tx.seat.findUnique({
                    where: { flightId_seatNumber: { flightId, seatNumber: seatId } },
                });
            }
            if (!seatRecord)
                throw new Error("Seat does not exist.");
            if (seatRecord.isBooked)
                throw new Error("Seat is already booked.");
            // Lock the seat
            await tx.seat.update({ where: { id: seatRecord.id }, data: { isBooked: true } });
            // Persist booking
            const record = await tx.booking.create({
                data: {
                    flightId,
                    passengerId,
                    seatId: seatRecord.id,
                    status: BookingStatus.CONFIRMED,
                    price: _price,
                },
            });
            return this.mapRecord(record);
        });
    }
    /** Return all bookings. */
    async findAll() {
        const records = await prisma.booking.findMany();
        return records.map((r) => this.mapRecord(r));
    }
    /** Find a single booking by its ID. */
    async findById(id) {
        const record = await prisma.booking.findUnique({ where: { id } });
        return record ? this.mapRecord(record) : null;
    }
    /** Find all bookings for a specific passenger. */
    async findByPassengerId(passengerId) {
        const records = await prisma.booking.findMany({ where: { passengerId } });
        return records.map((r) => this.mapRecord(r));
    }
    /** Cancel a booking and free its seat. */
    async cancel(bookingId) {
        return await prisma.$transaction(async (tx) => {
            const record = await tx.booking.findUnique({ where: { id: bookingId } });
            if (!record)
                throw new Error("Booking not found");
            if (record.status === BookingStatus.CANCELED) {
                throw new Error("Booking is already canceled");
            }
            // Free the seat
            await tx.seat.update({
                where: { id: record.seatId },
                data: { isBooked: false },
            });
            // Update status
            const updated = await tx.booking.update({
                where: { id: bookingId },
                data: { status: BookingStatus.CANCELED },
            });
            return this.mapRecord(updated);
        });
    }
    /** Permanently delete a booking record. */
    async delete(id) {
        await prisma.booking.delete({ where: { id } });
    }
    // ── Legacy methods (used internally / backwards compat) ───────────────────
    /** @deprecated Use create() instead. */
    async createBooking(flightId, passengerId, seatId) {
        return this.create(flightId, passengerId, seatId, 0);
    }
    /** @deprecated Use cancel() instead. */
    async cancelBooking(bookingId) {
        await this.cancel(bookingId);
    }
}
export const bookingService = BookingService.getInstance();
//# sourceMappingURL=BookingService.js.map