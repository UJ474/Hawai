export declare class AircraftService {
    /** Create a new aircraft — uses Aircraft model to validate/encapsulate, then persists */
    create(tailNumber: string, model: string, capacity: number): Promise<{
        model: string;
        tailNumber: string;
        capacity: number;
    }>;
    findAll(): Promise<({
        flights: {
            id: string;
            status: string;
            flightNumber: string;
            source: string;
            destination: string;
            departureTime: Date;
            arrivalTime: Date;
            aircraftId: string;
        }[];
    } & {
        model: string;
        tailNumber: string;
        capacity: number;
    })[]>;
    findByTailNumber(tailNumber: string): Promise<({
        flights: {
            id: string;
            status: string;
            flightNumber: string;
            source: string;
            destination: string;
            departureTime: Date;
            arrivalTime: Date;
            aircraftId: string;
        }[];
    } & {
        model: string;
        tailNumber: string;
        capacity: number;
    }) | null>;
    update(tailNumber: string, data: {
        model?: string;
        capacity?: number;
    }): Promise<{
        model: string;
        tailNumber: string;
        capacity: number;
    }>;
    delete(tailNumber: string): Promise<{
        model: string;
        tailNumber: string;
        capacity: number;
    }>;
}
export declare const aircraftService: AircraftService;
//# sourceMappingURL=AircraftService.d.ts.map