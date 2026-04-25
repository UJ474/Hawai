import { Flight, FlightStatus } from "../models/index.js";
export declare class FlightService {
    private static instance;
    private constructor();
    static getInstance(): FlightService;
    /** Map a Prisma flight record (with seats) to a Flight domain object */
    private mapRecord;
    /** Create a new flight */
    create(source: string, destination: string, departureTime: Date, arrivalTime: Date, aircraftId: string): Promise<Flight>;
    /** Get all flights, with optional filters */
    findAll(filters?: {
        source?: string;
        destination?: string;
        date?: string;
    }): Promise<Flight[]>;
    /** Get a single flight by ID */
    findById(id: string): Promise<Flight | null>;
    /** Update the status of a flight */
    updateStatus(id: string, status: FlightStatus): Promise<Flight>;
    /** Delete a flight */
    delete(id: string): Promise<void>;
    searchFlights(source: string, destination: string, date: Date): Promise<Flight[]>;
    getFlightDetails(flightId: string): Promise<Flight | null>;
}
export declare const flightService: FlightService;
//# sourceMappingURL=FlightService.d.ts.map