import { Router } from "express";
import { z } from "zod";
import { paymentService } from "../services/PaymentService.js";
import { PaymentMethod } from "../models/Payment.js";

const router = Router();

const processPaymentSchema = z.object({
  bookingId: z.string().min(1),
  method: z.nativeEnum(PaymentMethod),
  amount: z.number().positive(),
});

router.post("/", async (req, res) => {
  try {
    const parsed = processPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    const { bookingId, method, amount } = parsed.data;

    const payment = await paymentService.processPayment(bookingId, method, amount);
    res.status(201).json(payment);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.post("/:id/refund", async (req, res) => {
  try {
    const refundedPayment = await paymentService.refundPayment(req.params["id"]);
    res.status(200).json(refundedPayment);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

router.get("/methods", async (_req, res) => {
  try {
    const methods = await paymentService.getValidMethods();
    res.status(200).json(methods);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
