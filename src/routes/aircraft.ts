import { Router } from "express";
import { prisma } from "../db.js";
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

    const aircraft = await prisma.aircraft.create({
      data: { tailNumber, model, capacity },
    });
    res.status(201).json(aircraft);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const aircrafts = await prisma.aircraft.findMany({
      include: { flights: true },
    });
    res.json(aircrafts);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/:tailNumber", async (req, res) => {
  try {
    const aircraft = await prisma.aircraft.findUnique({
      where: { tailNumber: req.params["tailNumber"] },
      include: { flights: true },
    });
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

    const aircraft = await prisma.aircraft.update({
      where: { tailNumber: req.params["tailNumber"] },
      data: {
        ...(model !== undefined && { model }),
        ...(capacity !== undefined && { capacity }),
      },
    });
    res.json(aircraft);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.delete("/:tailNumber", async (req, res) => {
  try {
    await prisma.aircraft.delete({ where: { tailNumber: req.params["tailNumber"] } });
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

export default router;
