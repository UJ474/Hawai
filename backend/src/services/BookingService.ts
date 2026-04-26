import { prisma } from "../db.js";
import { Booking, BookingStatus } from "../models/index.js";

export class BookingService {
  private static instance: BookingService;

  private constructor() {}

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private mapRecord(record: {
    id: string;
    flightId: string;
    passengerId: string;
    seatId: string;
    status: string;
  }): Booking {
    return new Booking(
      record.id,
      record.flightId,
      record.passengerId,
      record.seatId,
      record.status as BookingStatus
    );
  }

  // ── Public API (used by routes) ────────────────────────────────────────────

  /**
   * Create a new booking (route-facing alias with flat args).
   * seatId here can be either the DB UUID or the human-readable seatNumber.
   * We resolve it to the actual seat record before proceeding.
   */
  public async create(
    flightId: string,
    passengerId: string,
    seatId: string,
    _price: number // kept for schema compatibility, stored on DB record
  ): Promise<Booking> {
    return await prisma.$transaction(async (tx) => {
      // Resolve seat — accept either a UUID (id) or a seatNumber string
      let seatRecord = await tx.seat.findUnique({ where: { id: seatId } });
      if (!seatRecord) {
        // Try resolving by (flightId, seatNumber) for human-readable seat labels
        seatRecord = await tx.seat.findUnique({
          where: { flightId_seatNumber: { flightId, seatNumber: seatId } },
        });
      }
      if (!seatRecord) throw new Error("Seat does not exist.");
      if (seatRecord.isBooked) throw new Error("Seat is already booked.");

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
  public async findAll(): Promise<Booking[]> {
    const records = await prisma.booking.findMany();
    return records.map((r) => this.mapRecord(r));
  }

  /** Find a single booking by its ID. */
  public async findById(id: string): Promise<Booking | null> {
    const record = await prisma.booking.findUnique({ where: { id } });
    return record ? this.mapRecord(record) : null;
  }

  /** Find all bookings for a specific passenger. */
  public async findByPassengerId(passengerId: string): Promise<Booking[]> {
    const records = await prisma.booking.findMany({ where: { passengerId } });
    return records.map((r) => this.mapRecord(r));
  }

  /** Cancel a booking and free its seat. */
  public async cancel(bookingId: string): Promise<Booking> {
    return await prisma.$transaction(async (tx) => {
      const record = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!record) throw new Error("Booking not found");
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
  public async delete(id: string): Promise<void> {
    await prisma.booking.delete({ where: { id } });
  }

  // ── Legacy methods (used internally / backwards compat) ───────────────────

  /** @deprecated Use create() instead. */
  public async createBooking(
    flightId: string,
    passengerId: string,
    seatId: string
  ): Promise<Booking> {
    return this.create(flightId, passengerId, seatId, 0);
  }

  /** @deprecated Use cancel() instead. */
  public async cancelBooking(bookingId: string): Promise<void> {
    await this.cancel(bookingId);
  }
}

export const bookingService = BookingService.getInstance();
