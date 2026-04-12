export declare class PassengerService {
    /** Create a new passenger — uses Passenger model logic, then persists */
    create(name: string, email: string, password: string, phone?: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
    }>;
    findAll(): Promise<({
        bookings: {
            id: string;
            flightId: string;
            passengerId: string;
            seatId: string;
            price: number;
            status: string;
            createdAt: Date;
        }[];
    } & {
        name: string;
        id: string;
        email: string;
        password: string;
    })[]>;
    findById(id: string): Promise<({
        bookings: {
            id: string;
            flightId: string;
            passengerId: string;
            seatId: string;
            price: number;
            status: string;
            createdAt: Date;
        }[];
    } & {
        name: string;
        id: string;
        email: string;
        password: string;
    }) | null>;
    findByEmail(email: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
    } | null>;
    update(id: string, data: {
        name?: string;
        email?: string;
    }): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
    }>;
    delete(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
    }>;
}
export declare const passengerService: PassengerService;
//# sourceMappingURL=PassengerService.d.ts.map