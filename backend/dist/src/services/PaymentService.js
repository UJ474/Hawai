import { prisma } from "../db.js";
import { Payment, PaymentMethod, PaymentStatus, PaymentFactory } from "../models/Payment.js";
export class PaymentService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }
    /**
     * Process a payment for a booking.
     * Logic:
     * 1. Check if booking exists and isn't already paid.
     * 2. Select appropriate PaymentStrategy (UPI/Card).
     * 3. Execute pay() via strategy.
     * 4. If successful, update Payment record and set Booking status to CONFIRMED.
     */
    async processPayment(bookingId, method, amount) {
        return await prisma.$transaction(async (tx) => {
            // 1. Fetch booking
            const bookingRecord = await tx.booking.findUnique({
                where: { id: bookingId },
                include: { payment: true },
            });
            if (!bookingRecord)
                throw new Error("Booking not found");
            if (bookingRecord.payment &&
                bookingRecord.payment.status === PaymentStatus.COMPLETED) {
                throw new Error("Booking is already paid for");
            }
            // 2. Strategy Selection via Factory
            const strategy = PaymentFactory.createStrategy(method);
            // 3. Create model and process
            const paymentId = Math.random().toString(36).substring(2, 11).toUpperCase();
            const paymentModel = new Payment(paymentId, bookingId, amount, PaymentStatus.COMPLETED, method);
            const isSuccess = paymentModel.processPayment(strategy);
            if (!isSuccess) {
                throw new Error("Payment gateway rejected the transaction");
            }
            // Create or update payment record
            await tx.payment.upsert({
                where: { bookingId },
                update: {
                    paymentMethod: paymentModel.getMethod(),
                    amount: paymentModel.getAmount(),
                    status: PaymentStatus.COMPLETED,
                },
                create: {
                    id: paymentModel.getPaymentId(),
                    paymentMethod: paymentModel.getMethod(),
                    amount: paymentModel.getAmount(),
                    status: PaymentStatus.COMPLETED,
                    bookingId: bookingId,
                },
            });
            // Update booking status
            await tx.booking.update({
                where: { id: bookingId },
                data: { status: "CONFIRMED" },
            });
            return paymentModel;
        });
    }
    /**
     * Refund a payment by setting its status to REFUNDED.
     * Also cancels the associated booking and frees the seat.
     */
    async refundPayment(paymentId) {
        return await prisma.$transaction(async (tx) => {
            // 1. Get payment and booking info
            const paymentRecord = await tx.payment.findUnique({
                where: { id: paymentId },
                include: { booking: true },
            });
            if (!paymentRecord)
                throw new Error("Payment record not found");
            // 2. Update payment status
            const record = await tx.payment.update({
                where: { id: paymentId },
                data: { status: PaymentStatus.REFUNDED },
            });
            // 3. Update booking status and free seat
            await tx.booking.update({
                where: { id: paymentRecord.bookingId },
                data: { status: "CANCELED" },
            });
            await tx.seat.update({
                where: { id: paymentRecord.booking.seatId },
                data: { isBooked: false },
            });
            return new Payment(record.id, record.bookingId, record.amount, record.status, record.paymentMethod);
        });
    }
    /**
     * Return the list of valid payment methods supported by the system.
     */
    getValidMethods() {
        return Object.values(PaymentMethod);
    }
}
export const paymentService = PaymentService.getInstance();
//# sourceMappingURL=PaymentService.js.map