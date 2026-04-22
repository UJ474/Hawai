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

router.post("/", async (req, res, next) => {
  try {
    const parsed = createPassengerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error });
      return;
    }
    const { name, email } = parsed.data;

    const passenger = await passengerService.create(name, email, "default-password");
    res.status(201).json(passenger);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const passengers = await passengerService.findAll();
    res.json(passengers);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const passenger = await passengerService.findById(req.params["id"]);
    if (!passenger) {
      res.status(404).json({ error: "Passenger not found" });
      return;
    }
    res.json(passenger);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const parsed = updatePassengerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error });
      return;
    }
    const { name, email } = parsed.data;

    const passenger = await passengerService.update(req.params["id"], { name, email });
    res.json(passenger);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await passengerService.delete(req.params["id"]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
