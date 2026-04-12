import { Payment, PaymentMethod } from "../models/Payment.js";
export declare class PaymentService {
    private static instance;
    private constructor();
    static getInstance(): PaymentService;
    /**
     * Process a payment for a booking.
     * Accepts the method and amount directly (no strategy object needed from the route layer).
     */
    processPayment(bookingId: string, method: PaymentMethod, amount: number): Promise<Payment>;
    /**
     * Refund a payment by setting its status to REFUNDED.
     */
    refundPayment(paymentId: string): Promise<Payment>;
    /**
     * Return the list of valid payment methods supported by the system.
     */
    getValidMethods(): PaymentMethod[];
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=PaymentService.d.ts.map