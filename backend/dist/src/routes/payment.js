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
router.post("/", async (req, res, next) => {
    try {
        const parsed = processPaymentSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: "Validation failed", details: parsed.error });
            return;
        }
        const { bookingId, method, amount } = parsed.data;
        const payment = await paymentService.processPayment(bookingId, method, amount);
        res.status(201).json(payment);
    }
    catch (err) {
        next(err);
    }
});
router.post("/:id/refund", async (req, res, next) => {
    try {
        const refundedPayment = await paymentService.refundPayment(req.params["id"]);
        res.status(200).json(refundedPayment);
    }
    catch (err) {
        next(err);
    }
});
router.get("/methods", async (_req, res, next) => {
    try {
        const methods = await paymentService.getValidMethods();
        res.status(200).json(methods);
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=payment.js.map