import { Router } from "express";
import { bookingService } from "../services/BookingService.js";
import { z } from "zod";

const router = Router();

const createBookingSchema = z.object({
  flightId: z.string().min(1),
  passengerId: z.string().min(1),
  seats: z.array(z.object({
    seatNumber: z.string().min(1),
    price: z.number().positive(),
  })),
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      // Fallback for single seat booking to maintain compatibility if needed
      const singleParsed = z.object({
        flightId: z.string().min(1),
        passengerId: z.string().min(1),
        seatNumber: z.string().min(1),
        price: z.number().positive(),
      }).safeParse(req.body);

      if (!singleParsed.success) {
        res.status(400).json({ error: "Validation failed", details: parsed.error });
        return;
      }
      
      const { flightId, passengerId, seatNumber, price } = singleParsed.data;
      const booking = await bookingService.create(flightId, passengerId, seatNumber, price);
      return res.status(201).json(booking);
    }

    const { flightId, passengerId, seats } = parsed.data;
    const seatNumbers = seats.map(s => s.seatNumber);
    const prices = seats.map(s => s.price);

    const bookings = await bookingService.createMany(flightId, passengerId, seatNumbers, prices);
    res.status(201).json(bookings);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const bookings = await bookingService.findAll();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const booking = await bookingService.findById(req.params["id"]);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

router.get("/passenger/:passengerId", async (req, res, next) => {
  try {
    const bookings = await bookingService.findByPassengerId(req.params["passengerId"]);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/cancel", async (req, res, next) => {
  try {
    const updated = await bookingService.cancel(req.params["id"]);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await bookingService.delete(req.params["id"]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
