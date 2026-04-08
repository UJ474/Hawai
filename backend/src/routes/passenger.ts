import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";

const router = Router();

const createPassengerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

const updatePassengerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

router.post("/", async (req, res) => {
  try {
    const parsed = createPassengerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    const { name, email } = parsed.data;

    const passenger = await prisma.passenger.create({ 
      data: { 
        name, 
        email,
        password: "default-password"
      } 
    });
    res.status(201).json(passenger);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const passengers = await prisma.passenger.findMany({
      include: { bookings: true },
    });
    res.json(passengers);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const passenger = await prisma.passenger.findUnique({
      where: { id: req.params["id"] },
      include: { bookings: true },
    });
    if (!passenger) {
      res.status(404).json({ error: "Passenger not found" });
      return;
    }
    res.json(passenger);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const parsed = updatePassengerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    const { name, email } = parsed.data;

    const passenger = await prisma.passenger.update({
      where: { id: req.params["id"] },
      data: { 
        ...(name !== undefined && { name }), 
        ...(email !== undefined && { email }) 
      },
    });
    res.json(passenger);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.passenger.delete({ where: { id: req.params["id"] } });
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

export default router;
