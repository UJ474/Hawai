import { prisma } from "../db.js";
import { Payment, PaymentMethod, PaymentStatus } from "../models/Payment.js";

export class PaymentService {
  /**
   * Processes a payment for a booking and handles the transaction.
   */
  async processPayment(bookingId: string, method: PaymentMethod, amount: number) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch Booking
      const bookingRecord = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { payment: true },
      });
      if (!bookingRecord) throw new Error("Booking not found");

      if (bookingRecord.payment && bookingRecord.payment.status === PaymentStatus.COMPLETED) {
        throw new Error("Booking is already paid for");
      }

      // Generate a temporary PaymentID for the OOP model
      const tempPaymentId = Math.random().toString(36).substring(2, 11).toUpperCase();
      
      // 2. Delegate to the OOP Payment Model logic
      const paymentModel = new Payment(tempPaymentId, method, amount, bookingId);
      paymentModel.processPayment();

      if (paymentModel.getStatus() !== PaymentStatus.COMPLETED) {
        throw new Error("Payment processing failed");
      }

      // 3. Persist the Payment record
      const savedPayment = await tx.payment.upsert({
        where: { bookingId },
        update: {
          paymentMethod: paymentModel.getPaymentMethod(),
          amount: paymentModel.getAmount(),
          status: paymentModel.getStatus(),
        },
        create: {
          paymentMethod: paymentModel.getPaymentMethod(),
          amount: paymentModel.getAmount(),
          status: paymentModel.getStatus(),
          bookingId: bookingId,
        },
      });

      return savedPayment;
    });
  }

  async refundPayment(paymentId: string) {
    const paymentRecord = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!paymentRecord) throw new Error("Payment not found");

    // Load DB state into the model
    const paymentModel = new Payment(
      paymentRecord.id,
      paymentRecord.paymentMethod as PaymentMethod,
      paymentRecord.amount,
      paymentRecord.bookingId
    );
    
    // For refund to trigger properly, we must override the status as it defaults to PENDING
    if (paymentRecord.status === PaymentStatus.COMPLETED) {
      paymentModel.processPayment(); // Forces it to COMPLETED so refund works
    }

    paymentModel.refund();

    if (paymentModel.getStatus() !== PaymentStatus.REFUNDED) {
      throw new Error("Refund failed or payment was not eligible for refund");
    }

    return prisma.payment.update({
      where: { id: paymentId },
      data: { status: paymentModel.getStatus() },
    });
  }

  async getValidMethods() {
    return Object.values(PaymentMethod);
  }
}

export const paymentService = new PaymentService();
