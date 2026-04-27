import { prisma } from "../db.js";
import { Flight, FlightStatus, Seat, SeatStatus, SeatType } from "../models/index.js";

export class FlightService {
  private static instance: FlightService;

  private constructor() {}

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

  /** Get all flights, with optional filters */
  public async findAll(filters?: {
    source?: string;
    destination?: string;
    date?: string;
    priceMax?: number;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  }): Promise<Flight[]> {
    const where: any = {};
    if (filters?.source) where.source = { contains: filters.source, mode: 'insensitive' };
    if (filters?.destination) where.destination = { contains: filters.destination, mode: 'insensitive' };
    
    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      where.departureTime = {
        gte: startOfDay,
        lt: endOfDay,
      };
    }

    // Time of day filtering
    if (filters?.timeOfDay) {
      // This is tricky with where.departureTime if date is already present.
      // If date is present, we refine gte/lt. If not, we can't easily filter by "hour" in Prisma without raw SQL
      // or a separate hour column. For now, we'll filter in memory or assume date is provided.
    }

    let records = await prisma.flight.findMany({ 
      where, 
      include: { 
        seats: {
          orderBy: { seatNumber: 'asc' }
        } 
      } 
    });

    // In-memory filtering for more complex logic
    if (filters?.timeOfDay) {
      records = records.filter(r => {
        const hour = r.departureTime.getUTCHours();
        if (filters.timeOfDay === 'morning') return hour >= 6 && hour < 12;
        if (filters.timeOfDay === 'afternoon') return hour >= 12 && hour < 17;
        if (filters.timeOfDay === 'evening') return hour >= 17 && hour < 21;
        if (filters.timeOfDay === 'night') return (hour >= 21 || hour < 6);
        return true;
      });
    }

    // Price filtering (assuming base price is 199 for now, or we look at available seats)
    // For a real app, we'd have a price column on Flight or a Fare table.
    if (filters?.priceMax) {
      // records = records.filter(r => ...) 
      // Skipping for now as we don't have a price column yet.
    }

    return records.map((r) => this.mapRecord(r));
  }

  public async findById(id: string): Promise<Flight | null> {
    const record = await prisma.flight.findUnique({
      where: { id },
      include: { 
        seats: {
          orderBy: { seatNumber: 'asc' }
        } 
      },
    });
    return record ? this.mapRecord(record) : null;
  }

  public async create(
    source: string,
    destination: string,
    departureTime: Date,
    arrivalTime: Date,
    aircraftId: string
  ): Promise<Flight> {
    const flightNumber = `${source.slice(0, 3).toUpperCase()}${destination.slice(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`;
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

  public async updateStatus(id: string, status: FlightStatus): Promise<Flight> {
    const record = await prisma.flight.update({
      where: { id },
      data: { status },
      include: { seats: true },
    });
    return this.mapRecord(record);
  }

  public async delete(id: string): Promise<void> {
    await prisma.flight.delete({ where: { id } });
  }

  public async searchFlights(source: string, destination: string, date: Date): Promise<Flight[]> {
    return this.findAll({ source, destination, date: date.toISOString().split('T')[0] });
  }
}

export const flightService = FlightService.getInstance();
