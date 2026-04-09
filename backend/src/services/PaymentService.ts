import { prisma } from "../db.js";
import { Payment, PaymentMethod, PaymentStatus } from "../models/Payment.js";

export class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Process a payment for a booking.
   * Accepts the method and amount directly (no strategy object needed from the route layer).
   */
  public async processPayment(
    bookingId: string,
    method: PaymentMethod,
    amount: number
  ): Promise<Payment> {
    return await prisma.$transaction(async (tx) => {
      const bookingRecord = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { payment: true },
      });
      if (!bookingRecord) throw new Error("Booking not found");

      if (
        bookingRecord.payment &&
        bookingRecord.payment.status === PaymentStatus.COMPLETED
      ) {
        throw new Error("Booking is already paid for");
      }

      const paymentId = Math.random().toString(36).substring(2, 11).toUpperCase();

      const paymentModel = new Payment(
        paymentId,
        bookingId,
        amount,
        PaymentStatus.COMPLETED,
        method
      );

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

      return paymentModel;
    });
  }

  /**
   * Refund a payment by setting its status to REFUNDED.
   */
  public async refundPayment(paymentId: string): Promise<Payment> {
    const record = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.REFUNDED },
    });

    return new Payment(
      record.id,
      record.bookingId,
      record.amount,
      record.status as PaymentStatus,
      record.paymentMethod as PaymentMethod
    );
  }

  /**
   * Return the list of valid payment methods supported by the system.
   */
  public getValidMethods(): PaymentMethod[] {
    return Object.values(PaymentMethod);
  }
}

export const paymentService = PaymentService.getInstance();
