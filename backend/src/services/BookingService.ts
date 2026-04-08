import { prisma } from "../db.js";
import { Booking, BookingStatus, Flight, Aircraft, Passenger, Seat, SeatType } from "../models/index.js";

export class BookingService {
  /**
   * Create a new booking
   *
   * Uses Models:
   * - Flight, Aircraft, Passenger models to instantiate the Booking model
   * - Booking model generateId(), initial Pending state, and confirms it.
   */
  async create(flightId: string, passengerId: string, seatNumber: string, price: number) {
    // We use a Prisma Transaction to safely book the seat and eliminate race conditions
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch Flight and Passenger
      const flightRecord = await tx.flight.findUnique({
        where: { id: flightId },
        include: { aircraft: true },
      });
      if (!flightRecord) throw new Error("Flight not found");

      const passengerRecord = await tx.passenger.findUnique({
        where: { id: passengerId },
      });
      if (!passengerRecord) throw new Error("Passenger not found");

      // 2. Locate the specific Seat instance to lock it
      const seatRecord = await tx.seat.findUnique({
        where: { flightId_seatNumber: { flightId, seatNumber } }
      });
      if (!seatRecord) throw new Error(`Seat ${seatNumber} does not exist on this flight.`);
      if (seatRecord.isBooked) throw new Error(`Seat ${seatNumber} is already booked!`);

      // 3. Mark the seat as booked
      await tx.seat.update({
        where: { id: seatRecord.id },
        data: { isBooked: true },
      });

      // 4. Map OOP paradigms for tracking (even if we save directly)
      const aircraftModel = new Aircraft(
        flightRecord.aircraft.tailNumber,
        flightRecord.aircraft.model,
        flightRecord.aircraft.capacity
      );
      const flightModel = new Flight(
        flightRecord.source,
        flightRecord.destination,
        flightRecord.departureTime,
        flightRecord.arrivalTime,
        aircraftModel
      );
      const passengerModel = new Passenger(passengerRecord.name, passengerRecord.email);
      // Constructing OOP Seat using DB state
      // Provide valid cast or matching SeatType
      const seatModel = new Seat(seatRecord.seatNumber, seatRecord.type as SeatType);

      // Book it via OOP model validation
      const bookingModel = new Booking(flightModel, passengerModel, seatModel, price);
      bookingModel.confirm();

      // 5. Persist the Booking relation mapping the exact seat ID
      return tx.booking.create({
        data: {
          flightId,
          passengerId,
          seatId: seatRecord.id,
          price: bookingModel.getPrice(),
          status: bookingModel.getStatus(),
        },
        include: { flight: true, passenger: true, seat: true },
      });
    });
  }

  async findAll() {
    return prisma.booking.findMany({
      include: { flight: true, passenger: true, seat: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: { flight: { include: { aircraft: true } }, passenger: true, seat: true },
    });
  }

  async findByPassengerId(passengerId: string) {
    return prisma.booking.findMany({
      where: { passengerId },
      include: { flight: true, seat: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Cancels a booking, freeing the associated seat in a transaction
   */
  async cancel(id: string) {
    return await prisma.$transaction(async (tx) => {
      const bookingRecord = await tx.booking.findUnique({ where: { id } });
      if (!bookingRecord) throw new Error("Booking not found");

      if (bookingRecord.status === BookingStatus.CANCELED) {
        throw new Error("Booking is already canceled");
      }

      // Mark the seat as available again
      await tx.seat.update({
        where: { id: bookingRecord.seatId },
        data: { isBooked: false },
      });

      return tx.booking.update({
        where: { id },
        data: { status: BookingStatus.CANCELED },
        include: { flight: true, passenger: true, seat: true },
      });
    });
  }

  async delete(id: string) {
    return prisma.booking.delete({ where: { id } });
  }
}

export const bookingService = new BookingService();
