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

  private mapRecord(record: any): Booking {
    return new Booking(
      record.id,
      record.flightId,
      record.passengerId,
      record.seatId,
      record.status as BookingStatus
    );
  }

  public async create(
    flightId: string,
    passengerId: string,
    seatId: string,
    price: number
  ): Promise<Booking> {
    const results = await this.createMany(flightId, passengerId, [seatId], [price]);
    return results[0];
  }

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

  public async findAll(): Promise<Booking[]> {
    const records = await prisma.booking.findMany();
    return records.map((r) => this.mapRecord(r));
  }

  public async findById(id: string): Promise<Booking | null> {
    const record = await prisma.booking.findUnique({ where: { id } });
    return record ? this.mapRecord(record) : null;
  }

  public async findByPassengerId(passengerId: string): Promise<Booking[]> {
    const records = await prisma.booking.findMany({ where: { passengerId } });
    return records.map((r) => this.mapRecord(r));
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
