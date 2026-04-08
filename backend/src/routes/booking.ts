import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";

const router = Router();

const createBookingSchema = z.object({
  flightId: z.string().min(1),
  passengerId: z.string().min(1),
  seatNumber: z.string().min(1),
  price: z.number().positive(),
});

router.post("/", async (req, res) => {
  try {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    const { flightId, passengerId, seatNumber, price } = parsed.data;

    const existingBooking = await prisma.booking.findFirst({
      where: {
        flightId,
        seatNumber,
        status: { not: "CANCELED" },
      },
    });

    if (existingBooking) {
      res.status(409).json({ error: `Seat ${seatNumber} is already booked` });
      return;
    }

    const booking = await prisma.booking.create({
      data: {
        flightId,
        passengerId,
        seatNumber,
        price,
        status: "CONFIRMED",
      },
      include: { flight: true, passenger: true },
    });
    res.status(201).json(booking);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { flight: true, passenger: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params["id"] },
      include: { flight: { include: { aircraft: true } }, passenger: true },
    });
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json(booking);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/passenger/:passengerId", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { passengerId: req.params["passengerId"] },
      include: { flight: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.patch("/:id/cancel", async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params["id"] },
    });
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    if (booking.status === "CANCELED") {
      res.status(400).json({ error: "Booking is already canceled" });
      return;
    }
    const updated = await prisma.booking.update({
      where: { id: req.params["id"] },
      data: { status: "CANCELED" },
      include: { flight: true, passenger: true },
    });
    res.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.booking.delete({ where: { id: req.params["id"] } });
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

export default router;
