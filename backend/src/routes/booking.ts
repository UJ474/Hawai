import { Router } from "express";
import { bookingService } from "../services/BookingService.js";
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

    const booking = await bookingService.create(flightId, passengerId, seatNumber, price);
    res.status(201).json(booking);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await bookingService.findAll();
    res.json(bookings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const booking = await bookingService.findById(req.params["id"]);
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
    const bookings = await bookingService.findByPassengerId(req.params["passengerId"]);
    res.json(bookings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.patch("/:id/cancel", async (req, res) => {
  try {
    const updated = await bookingService.cancel(req.params["id"]);
    res.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await bookingService.delete(req.params["id"]);
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

export default router;
