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
    price: number;
    status: string;
  }): Booking & { price: number } {
    const booking = new Booking(
      record.id,
      record.flightId,
      record.passengerId,
      record.seatId,
      record.status as BookingStatus
    );
    // Attach price as an extra property for API responses
    return Object.assign(booking, { price: record.price });
  }

  // ── Public API (used by routes) ────────────────────────────────────────────

  /**
   * Create a new booking.
   * Accepts seatNumber (e.g. "1A") and resolves the actual seat record by flightId + seatNumber.
   */
  public async create(
    flightId: string,
    passengerId: string,
    seatNumber: string,
    price: number
  ): Promise<Booking> {
    return await prisma.$transaction(async (tx) => {
      // Look up the seat by flightId + seatNumber
      const seatRecord = await tx.seat.findUnique({
        where: {
          flightId_seatNumber: {
            flightId: flightId,
            seatNumber: seatNumber,
          },
        },
      });
      if (!seatRecord) throw new Error("Seat does not exist for this flight.");
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
          price: price,
        },
      });

  public async createMany(
    flightId: string,
    passengerId: string,
    seatIds: string[],
    prices: number[]
  ): Promise<Booking[]> {
    return await prisma.$transaction(async (tx) => {
      const bookings: Booking[] = [];
      
      for (let i = 0; i < seatIds.length; i++) {
        const seatId = seatIds[i];
        const price = prices[i];

        let seatRecord = await tx.seat.findUnique({ where: { id: seatId } });
        if (!seatRecord) {
          seatRecord = await tx.seat.findUnique({
            where: { flightId_seatNumber: { flightId, seatNumber: seatId } },
          });
        }
        
        if (!seatRecord) throw new Error(`Seat ${seatId} does not exist.`);
        if (seatRecord.isBooked) throw new Error(`Seat ${seatRecord.seatNumber} is already booked.`);

        await tx.seat.update({ where: { id: seatRecord.id }, data: { isBooked: true } });

        const record = await tx.booking.create({
          data: {
            flightId,
            passengerId,
            seatId: seatRecord.id,
            status: BookingStatus.CONFIRMED,
            price: price,
          },
        });
        bookings.push(this.mapRecord(record));
      }
      
      return bookings;
    });
  }

  /** Return all bookings with flight and seat details. */
  public async findAll(): Promise<any[]> {
    const records = await prisma.booking.findMany({
      include: {
        flight: true,
        seat: true,
      },
    });
    return records.map((r) => ({
      bookingId: r.id,
      flightId: r.flightId,
      passengerId: r.passengerId,
      seatId: r.seatId,
      price: r.price,
      status: r.status,
      createdAt: r.createdAt,
      flight: r.flight ? {
        source: r.flight.source,
        destination: r.flight.destination,
        departureTime: r.flight.departureTime,
        arrivalTime: r.flight.arrivalTime,
        flightNumber: r.flight.flightNumber,
        status: r.flight.status,
      } : null,
      seat: r.seat ? {
        seatNumber: r.seat.seatNumber,
        seatType: r.seat.type,
      } : null,
    }));
  }

  /** Find a single booking by its ID with details. */
  public async findById(id: string): Promise<any | null> {
    const r = await prisma.booking.findUnique({
      where: { id },
      include: {
        flight: true,
        seat: true,
        payment: true,
      },
    });
    if (!r) return null;
    return {
      bookingId: r.id,
      flightId: r.flightId,
      passengerId: r.passengerId,
      seatId: r.seatId,
      price: r.price,
      status: r.status,
      createdAt: r.createdAt,
      flight: r.flight ? {
        source: r.flight.source,
        destination: r.flight.destination,
        departureTime: r.flight.departureTime,
        arrivalTime: r.flight.arrivalTime,
        flightNumber: r.flight.flightNumber,
        status: r.flight.status,
      } : null,
      seat: r.seat ? {
        seatNumber: r.seat.seatNumber,
        seatType: r.seat.type,
      } : null,
      payment: r.payment ? {
        paymentId: r.payment.id,
        amount: r.payment.amount,
        method: r.payment.paymentMethod,
        status: r.payment.status,
      } : null,
    };
  }

  /** Find all bookings for a specific passenger with details. */
  public async findByPassengerId(passengerId: string): Promise<any[]> {
    const records = await prisma.booking.findMany({
      where: { passengerId },
      include: {
        flight: true,
        seat: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return records.map((r) => ({
      bookingId: r.id,
      flightId: r.flightId,
      passengerId: r.passengerId,
      seatId: r.seatId,
      price: r.price,
      status: r.status,
      createdAt: r.createdAt,
      flight: r.flight ? {
        source: r.flight.source,
        destination: r.flight.destination,
        departureTime: r.flight.departureTime,
        arrivalTime: r.flight.arrivalTime,
        flightNumber: r.flight.flightNumber,
        status: r.flight.status,
      } : null,
      seat: r.seat ? {
        seatNumber: r.seat.seatNumber,
        seatType: r.seat.type,
      } : null,
      payment: r.payment ? {
        paymentId: r.payment.id,
        amount: r.payment.amount,
        method: r.payment.paymentMethod,
        status: r.payment.status,
      } : null,
    }));
  }

  public async cancel(bookingId: string): Promise<Booking> {
    return await prisma.$transaction(async (tx) => {
      const record = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!record) throw new Error("Booking not found");
      if (record.status === BookingStatus.CANCELED) throw new Error("Already canceled");

      await tx.seat.update({
        where: { id: record.seatId },
        data: { isBooked: false },
      });

      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELED },
      });

      return this.mapRecord(updated);
    });
  }

  public async delete(id: string): Promise<void> {
    await prisma.booking.delete({ where: { id } });
  }
}

export const bookingService = BookingService.getInstance();
