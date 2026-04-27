import { Router, Request, Response } from "express";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { passengerService } from "../services/PassengerService.js";
import { z } from "zod";

const router = Router();
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return secret;
};

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

router.post("/signup", async (req: Request, res: Response, next): Promise<void> => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error });
      return;
    }
    const { name, email, password } = parsed.data;

    const existingUser = await passengerService.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "Conflict", message: "Email is already in use" });
      return;
    }

    const passenger = await passengerService.create(name, email, password);

    const { password: _, ...userWithoutPassword } = passenger;
    res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req: Request, res: Response, next): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error });
      return;
    }
    const { email, password } = parsed.data;

    const passenger = await passengerService.findByEmail(email);
    if (!passenger) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, passenger.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: passenger.id, email: passenger.email },
      getJwtSecret(),
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = passenger;
    res.json({ message: "Login successful", token, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
});

export default router;
