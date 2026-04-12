import { prisma } from "../db.js";
import { Aircraft } from "../models/index.js";
export class AircraftService {
    /** Create a new aircraft — uses Aircraft model to validate/encapsulate, then persists */
    async create(tailNumber, model, capacity) {
        // Use model to encapsulate data (validates shape, holds business methods)
        const aircraft = new Aircraft(tailNumber, model, capacity);
        return prisma.aircraft.create({
            data: {
                tailNumber: aircraft.getTailNumber(),
                model: aircraft.getModel(),
                capacity: aircraft.getCapacity(),
            },
        });
    }
    async findAll() {
        return prisma.aircraft.findMany({ include: { flights: true } });
    }
    async findByTailNumber(tailNumber) {
        return prisma.aircraft.findUnique({
            where: { tailNumber },
            include: { flights: true },
        });
    }
    async update(tailNumber, data) {
        return prisma.aircraft.update({
            where: { tailNumber },
            data,
        });
    }
    async delete(tailNumber) {
        return prisma.aircraft.delete({ where: { tailNumber } });
    }
}
export const aircraftService = new AircraftService();
//# sourceMappingURL=AircraftService.js.map