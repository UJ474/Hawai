import { prisma } from "../db.js";
import { Passenger } from "../models/index.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
export class PassengerService {
    /** Create a new passenger — uses Passenger model logic, then persists */
    async create(name, email, password, phone = "") {
        // Passenger constructor: (passengerId, name, email, phone)
        const passenger = new Passenger(randomUUID(), name, email, phone);
        const hashedPassword = await bcrypt.hash(password, 10);
        return prisma.passenger.create({
            data: {
                id: passenger.getPassengerId(),
                name: passenger.getName(),
                email: passenger.getEmail(),
                password: hashedPassword,
            },
        });
    }
    async findAll() {
        return prisma.passenger.findMany({ include: { bookings: true } });
    }
    async findById(id) {
        return prisma.passenger.findUnique({
            where: { id },
            include: { bookings: true },
        });
    }
    async findByEmail(email) {
        return prisma.passenger.findUnique({ where: { email } });
    }
    async update(id, data) {
        return prisma.passenger.update({ where: { id }, data });
    }
    async delete(id) {
        return prisma.passenger.delete({ where: { id } });
    }
}
export const passengerService = new PassengerService();
//# sourceMappingURL=PassengerService.js.map