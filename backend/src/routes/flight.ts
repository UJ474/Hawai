import { Router } from "express";
import { flightService } from "../services/FlightService.js";
import { z } from "zod";

const router = Router();

const createFlightSchema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  departureTime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date string" }),
  arrivalTime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date string" }),
  aircraftId: z.string().min(1),
});

const flightQuerySchema = z.object({
  source: z.string().optional(),
  destination: z.string().optional(),
  date: z.string().optional(),
  priceMax: z.string().transform(Number).optional(),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
});

router.get("/", async (req, res, next) => {
  try {
    const parsed = flightQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return next(parsed.error);
    }
    const flights = await flightService.findAll(parsed.data);
    res.json(flights);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = createFlightSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(parsed.error);
    }
    const { source, destination, departureTime, arrivalTime, aircraftId } = parsed.data;

    const flight = await flightService.create(
      source,
      destination,
      new Date(departureTime),
      new Date(arrivalTime),
      aircraftId
    );
    res.status(201).json(flight);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const flight = await flightService.findById(req.params["id"]);
    if (!flight) {
      res.status(404).json({ error: "Flight not found" });
      return;
    }
    res.json(flight);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const status = req.body.status;
    const flight = await flightService.updateStatus(req.params["id"], status as any);
    res.json(flight);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await flightService.delete(req.params["id"]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
