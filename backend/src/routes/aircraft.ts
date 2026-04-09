import { Router } from "express";
import { aircraftService } from "../services/AircraftService.js";
import { z } from "zod";

const router = Router();

const createAircraftSchema = z.object({
  tailNumber: z.string().min(1),
  model: z.string().min(1),
  capacity: z.number().int().positive(),
});

const updateAircraftSchema = z.object({
  model: z.string().min(1).optional(),
  capacity: z.number().int().positive().optional(),
});

router.post("/", async (req, res) => {
  try {
    const parsed = createAircraftSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    const { tailNumber, model, capacity } = parsed.data;

    const aircraft = await aircraftService.create(tailNumber, model, capacity);
    res.status(201).json(aircraft);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const aircrafts = await aircraftService.findAll();
    res.json(aircrafts);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/:tailNumber", async (req, res) => {
  try {
    const aircraft = await aircraftService.findByTailNumber(req.params.tailNumber);
    if (!aircraft) {
      res.status(404).json({ error: "Aircraft not found" });
      return;
    }
    res.json(aircraft);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.put("/:tailNumber", async (req, res) => {
  try {
    const parsed = updateAircraftSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    const { model, capacity } = parsed.data;

    const aircraft = await aircraftService.update(req.params.tailNumber, {
      model,
      capacity,
    });
    res.json(aircraft);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.delete("/:tailNumber", async (req, res) => {
  try {
    await aircraftService.delete(req.params.tailNumber);
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

export default router;
