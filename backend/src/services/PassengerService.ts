import { prisma } from "../db.js";
import { Passenger } from "../models/index.js";
import bcrypt from "bcrypt";

export class PassengerService {
  /** Create a new passenger — uses Passenger model logic, then persists */
  async create(name: string, email: string, password: string) {
    // Model encapsulates identity concerns
    const passenger = new Passenger(name, email);
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.passenger.create({
      data: {
        name: passenger.getName(),
        email: passenger.getEmail(),
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return prisma.passenger.findMany({ include: { bookings: true } });
  }

  async findById(id: string) {
    return prisma.passenger.findUnique({
      where: { id },
      include: { bookings: true },
    });
  }

  async findByEmail(email: string) {
    return prisma.passenger.findUnique({ where: { email } });
  }

  async update(id: string, data: { name?: string; email?: string }) {
    return prisma.passenger.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.passenger.delete({ where: { id } });
  }
}

export const passengerService = new PassengerService();
