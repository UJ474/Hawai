import { prisma } from "../db.js";
import { Passenger } from "../models/index.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export class PassengerService {
  private static instance: PassengerService;

  private constructor() {}

  public static getInstance(): PassengerService {
    if (!PassengerService.instance) {
      PassengerService.instance = new PassengerService();
    }
    return PassengerService.instance;
  }

  /** Create a new passenger — uses Passenger model logic, then persists */
  async create(name: string, email: string, password: string, phone = "") {
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

export const passengerService = PassengerService.getInstance();
