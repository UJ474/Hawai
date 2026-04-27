import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.aircraft.deleteMany();
  await prisma.passenger.deleteMany();

  console.log("Seeding database...");

  // 1. Create Passengers
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.passenger.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
    },
  });

  // 2. Create Aircrafts
  const aircrafts = await Promise.all([
    prisma.aircraft.create({
      data: { tailNumber: "HW-A320", model: "Airbus A320", capacity: 180 },
    }),
    prisma.aircraft.create({
      data: { tailNumber: "HW-B737", model: "Boeing 737-800", capacity: 160 },
    }),
    prisma.aircraft.create({
      data: { tailNumber: "HW-B787", model: "Boeing 787 Dreamliner", capacity: 250 },
    }),
  ]);

  const cities = ["Delhi", "Mumbai", "Bangalore", "Goa", "Dubai", "London", "New York", "Singapore", "Sydney"];
  const flightPrefixes = ["HW", "AI", "UK", "6E"];

  // 3. Create Flights
  for (let i = 0; i < 20; i++) {
    const source = cities[Math.floor(Math.random() * cities.length)];
    let destination = cities[Math.floor(Math.random() * cities.length)];
    while (destination === source) {
      destination = cities[Math.floor(Math.random() * cities.length)];
    }

    const aircraft = aircrafts[Math.floor(Math.random() * aircrafts.length)];
    const flightNumber = `${flightPrefixes[Math.floor(Math.random() * flightPrefixes.length)]}-${100 + i}`;
    
    // Random date within next 30 days
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + Math.floor(Math.random() * 30));
    departureDate.setHours(Math.floor(Math.random() * 24), 0, 0, 0);

    const arrivalDate = new Date(departureDate.getTime() + (2 + Math.random() * 12) * 60 * 60 * 1000);

    const flight = await prisma.flight.create({
      data: {
        flightNumber,
        source,
        destination,
        departureTime: departureDate,
        arrivalTime: arrivalDate,
        aircraftId: aircraft.tailNumber,
        status: "SCHEDULED",
      },
    });

    // Create Seats for this flight
    const seatData = [];
    const rows = ["A", "B", "C", "D", "E", "F"];
    const numRows = 10; // 10 rows for each flight in seed

    for (let r = 1; r <= numRows; r++) {
      for (const col of rows) {
        const type = r <= 2 ? "BUSINESS" : "ECONOMY";
        seatData.push({
          seatNumber: `${r}${col}`,
          type,
          flightId: flight.id,
          isBooked: Math.random() > 0.8, // 20% seats pre-booked
        });
      }
    }

    await prisma.seat.createMany({ data: seatData });
  }

  console.log("✅ Database seeded successfully with 20 flights and 1200 seats!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });