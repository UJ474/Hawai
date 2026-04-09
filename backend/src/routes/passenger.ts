import { Router } from "express";
import { passengerService } from "../services/PassengerService.js";
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

    const passenger = await passengerService.create(name, email, "default-password");
    res.status(201).json(passenger);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.get("/", async (req, res) => {
  try {
    const passengers = await passengerService.findAll();
    res.json(passengers);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const passenger = await passengerService.findById(req.params["id"]);
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

    const passenger = await passengerService.update(req.params["id"], { name, email });
    res.json(passenger);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await passengerService.delete(req.params["id"]);
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

export default router;
