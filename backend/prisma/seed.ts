// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// async function main() {
//   // 1. Create Passenger
//   const passenger = await prisma.passenger.create({
//     data: {
//       name: "Test User",
//       email: "test@test.com",
//       password: await bcrypt.hash("password123", 10),
//     },
//   });

//   // 2. Create Aircraft
//   const aircraft = await prisma.aircraft.create({
//     data: {
//       tailNumber: "AI-101",
//       model: "Boeing 737",
//       capacity: 180,
//     },
//   });

//   // 3. Create Flight with Seats
//   const flight = await prisma.flight.create({
//     data: {
//       flightNumber: "AI-101",
//       source: "Delhi",
//       destination: "Mumbai",
//       departureTime: new Date("2025-06-01T10:00:00Z"),
//       arrivalTime: new Date("2025-06-01T12:00:00Z"),
//       aircraftId: aircraft.tailNumber,
//       seats: {
//         create: [
//           { seatNumber: "1A", type: "BUSINESS" },
//           { seatNumber: "1B", type: "ECONOMY" },
//         ],
//       },
//     },
//   });

//   console.log("Seeded:", { passenger, aircraft, flight });
// }

// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect());