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
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date string" }).optional(),
});
const patchFlightStatusSchema = z.object({
    status: z.enum(["SCHEDULED", "ON_TIME", "DELAYED", "CANCELLED"]),
});
router.post("/", async (req, res, next) => {
    try {
        const parsed = createFlightSchema.safeParse(req.body);
        if (!parsed.success) {
            return next(parsed.error);
        }
        const { source, destination, departureTime, arrivalTime, aircraftId } = parsed.data;
        const flight = await flightService.create(source, destination, new Date(departureTime), new Date(arrivalTime), aircraftId);
        res.status(201).json(flight);
    }
    catch (err) {
        next(err);
    }
});
router.get("/", async (req, res, next) => {
    try {
        const parsed = flightQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return next(parsed.error);
        }
        const { source, destination, date } = parsed.data;
        const flights = await flightService.findAll({ source, destination, date });
        res.json(flights);
    }
    catch (err) {
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
    }
    catch (err) {
        next(err);
    }
});
router.patch("/:id/status", async (req, res, next) => {
    try {
        const parsed = patchFlightStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: "Validation failed", details: parsed.error });
            return;
        }
        const { status } = parsed.data;
        const flight = await flightService.updateStatus(req.params["id"], status);
        res.json(flight);
    }
    catch (err) {
        next(err);
    }
});
router.delete("/:id", async (req, res, next) => {
    try {
        await flightService.delete(req.params["id"]);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=flight.js.map