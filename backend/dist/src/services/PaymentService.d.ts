import { Payment, PaymentMethod } from "../models/Payment.js";
export declare class PaymentService {
    private static instance;
    private constructor();
    static getInstance(): PaymentService;
    /**
     * Process a payment for a booking.
     * Logic:
     * 1. Check if booking exists and isn't already paid.
     * 2. Select appropriate PaymentStrategy (UPI/Card).
     * 3. Execute pay() via strategy.
     * 4. If successful, update Payment record and set Booking status to CONFIRMED.
     */
    processPayment(bookingId: string, method: PaymentMethod, amount: number): Promise<Payment>;
    /**
     * Refund a payment by setting its status to REFUNDED.
     * Also cancels the associated booking and frees the seat.
     */
    refundPayment(paymentId: string): Promise<Payment>;
    /**
     * Return the list of valid payment methods supported by the system.
     */
    getValidMethods(): PaymentMethod[];
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=PaymentService.d.ts.map