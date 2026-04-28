import { prisma } from "../db.js";
import { Flight, FlightStatus, Seat, SeatStatus } from "../models/index.js";
export class FlightService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!FlightService.instance) {
            FlightService.instance = new FlightService();
        }
        return FlightService.instance;
    }
    /** Map a Prisma flight record (with seats) to a Flight domain object */
    mapRecord(record) {
        const seats = (record.seats ?? []).map((s) => new Seat(s.id, s.seatNumber, s.type, record.id, s.isBooked ? SeatStatus.BOOKED : SeatStatus.AVAILABLE));
        return new Flight(record.id, record.source, record.destination, record.departureTime, record.arrivalTime, record.status, seats);
    }
    /** Create a new flight */
    async create(source, destination, departureTime, arrivalTime, aircraftId) {
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
    async findAll(filters) {
        const where = {};
        if (filters?.source)
            where.source = filters.source;
        if (filters?.destination)
            where.destination = filters.destination;
        if (filters?.date) {
            const d = new Date(filters.date);
            where.departureTime = {
                gte: new Date(d.setHours(0, 0, 0, 0)),
                lt: new Date(d.setHours(23, 59, 59, 999)),
            };
        }
        const records = await prisma.flight.findMany({ where, include: { seats: true } });
        return records.map((r) => this.mapRecord(r));
    }
    /** Get a single flight by ID */
    async findById(id) {
        const record = await prisma.flight.findUnique({
            where: { id },
            include: { seats: true },
        });
        return record ? this.mapRecord(record) : null;
    }
    /** Update the status of a flight */
    async updateStatus(id, status) {
        const record = await prisma.flight.update({
            where: { id },
            data: { status },
            include: { seats: true },
        });
        return this.mapRecord(record);
    }
    /** Delete a flight */
    async delete(id) {
        await prisma.flight.delete({ where: { id } });
    }
    // ── Legacy aliases (kept for backwards compatibility) ─────────────────────
    async searchFlights(source, destination, date) {
        return this.findAll({ source, destination, date: date.toISOString() });
    }
    async getFlightDetails(flightId) {
        return this.findById(flightId);
    }
}
export const flightService = FlightService.getInstance();
//# sourceMappingURL=FlightService.js.map