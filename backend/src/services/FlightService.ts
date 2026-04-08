import { prisma } from "../db.js";
import { Aircraft, Flight, FlightStatus, Seat, SeatType } from "../models/index.js";

export class FlightService {
  /**
   * Create a flight — uses the Flight model to:
   * - generate the flight number
   * - validate departureTime < arrivalTime (via model semantics)
   * Then persists to DB via Prisma.
   */
  async create(
    source: string,
    destination: string,
    departureTime: Date,
    arrivalTime: Date,
    aircraftId: string
  ) {
    // Fetch the aircraft from DB first
    const aircraftRecord = await prisma.aircraft.findUnique({ where: { tailNumber: aircraftId } });
    if (!aircraftRecord) throw new Error("Aircraft not found");

    // Build model objects
    const aircraftModel = new Aircraft(
      aircraftRecord.tailNumber,
      aircraftRecord.model,
      aircraftRecord.capacity
    );
    const flightModel = new Flight(source, destination, departureTime, arrivalTime, aircraftModel);

    // Auto-populate seats based on aircraft capacity
    const seatData = [];
    for (let i = 1; i <= aircraftModel.getCapacity(); i++) {
      const seatNumber = `${Math.ceil(i / 6)}${String.fromCharCode(64 + ((i - 1) % 6) + 1)}`;
      const type =
        i <= Math.floor(aircraftModel.getCapacity() * 0.05)
          ? SeatType.FIRST_CLASS
          : i <= Math.floor(aircraftModel.getCapacity() * 0.2)
          ? SeatType.BUSINESS
          : i <= Math.floor(aircraftModel.getCapacity() * 0.35)
          ? SeatType.PREMIUM_ECONOMY
          : SeatType.ECONOMY;
      
      seatData.push({
        seatNumber,
        type,
        isBooked: false,
      });
    }

    return prisma.flight.create({
      data: {
        flightNumber: flightModel.getFlightNumber(),
        source: flightModel.getSource(),
        destination: flightModel.getDestination(),
        departureTime: flightModel.getDepartureTime(),
        arrivalTime: flightModel.getArrivalTime(),
        aircraftId,
        status: flightModel.getStatus(),
        seats: {
          create: seatData,
        },
      },
      include: { aircraft: true, seats: true },
    });
  }

  async findAll(filters?: { source?: string; destination?: string; date?: string }) {
    return prisma.flight.findMany({
      where: {
        source: filters?.source,
        destination: filters?.destination,
        departureTime: filters?.date
          ? {
              gte: new Date(filters.date),
              lt: new Date(new Date(filters.date).getTime() + 86_400_000),
            }
          : undefined,
      },
      include: { aircraft: true, bookings: true },
    });
  }

  async findById(id: string) {
    return prisma.flight.findUnique({
      where: { id },
      include: { aircraft: true, bookings: { include: { passenger: true } } },
    });
  }

  /**
   * Update flight status — uses FlightStatus enum from the Flight model
   * to ensure only valid statuses are passed.
   */
  async updateStatus(id: string, status: FlightStatus) {
    return prisma.flight.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string) {
    return prisma.flight.delete({ where: { id } });
  }
}

export const flightService = new FlightService();
