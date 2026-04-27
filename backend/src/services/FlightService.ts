import { prisma } from "../db.js";
import { Flight, FlightStatus, Seat, SeatStatus, SeatType } from "../models/index.js";

export class FlightService {
  private static instance: FlightService;

  public static getInstance(): FlightService {
    if (!FlightService.instance) {
      FlightService.instance = new FlightService();
    }
    return FlightService.instance;
  }

  /** Map a Prisma flight record (with seats) to a Flight domain object */
  private mapRecord(record: any): Flight {
    const seats = (record.seats ?? []).map(
      (s: any) =>
        new Seat(
          s.id,
          s.seatNumber,
          s.type as SeatType,
          record.id,
          s.isBooked ? SeatStatus.BOOKED : SeatStatus.AVAILABLE
        )
    );
    return new Flight(
      record.id,
      record.source,
      record.destination,
      record.departureTime,
      record.arrivalTime,
      record.status as FlightStatus,
      seats
    );
  }

  /** Create a new flight */
  public async create(
    source: string,
    destination: string,
    departureTime: Date,
    arrivalTime: Date,
    aircraftId: string
  ): Promise<Flight> {
    const flightNumber = `${source.slice(0, 3).toUpperCase()}${destination.slice(0, 3).toUpperCase()}${Date.now()}`;
    const record = await prisma.flight.create({
      data: {
        flightNumber,
        source,
        destination,
        departureTime,
        arrivalTime,
        status: FlightStatus.ON_TIME,
        aircraftId,
      },
      include: { seats: true },
    });
    return this.mapRecord(record);
  }

  /** Get all flights, with optional filters */
  public async findAll(filters?: {
    source?: string;
    destination?: string;
    date?: string;
  }): Promise<Flight[]> {
    const where: any = {};
    if (filters?.source) where.source = { contains: filters.source };
    if (filters?.destination) where.destination = { contains: filters.destination };
    if (filters?.date) {
      const d = new Date(filters.date);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      where.departureTime = {
        gte: startOfDay,
        lt: endOfDay,
      };
    }
    const records = await prisma.flight.findMany({ where, include: { seats: true } });
    return records.map((r) => this.mapRecord(r));
  }

  /** Get a single flight by ID */
  public async findById(id: string): Promise<Flight | null> {
    const record = await prisma.flight.findUnique({
      where: { id },
      include: { seats: true },
    });
    return record ? this.mapRecord(record) : null;
  }

  /** Update the status of a flight */
  public async updateStatus(id: string, status: FlightStatus): Promise<Flight> {
    const record = await prisma.flight.update({
      where: { id },
      data: { status },
      include: { seats: true },
    });
    return this.mapRecord(record);
  }

  /** Delete a flight */
  public async delete(id: string): Promise<void> {
    await prisma.flight.delete({ where: { id } });
  }

  // ── Legacy aliases (kept for backwards compatibility) ─────────────────────

  public async searchFlights(source: string, destination: string, date: Date): Promise<Flight[]> {
    return this.findAll({ source, destination, date: date.toISOString() });
  }

  public async getFlightDetails(flightId: string): Promise<Flight | null> {
    return this.findById(flightId);
  }
}

export const flightService = FlightService.getInstance();
