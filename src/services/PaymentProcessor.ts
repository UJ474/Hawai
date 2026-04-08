import { Payment, PaymentStatus } from "../models/Payment.js";

export class PaymentProcessor {
  private static instance: PaymentProcessor;

  private constructor() {}

  static getInstance(): PaymentProcessor {
    if (!PaymentProcessor.instance) {
      PaymentProcessor.instance = new PaymentProcessor();
    }
    return PaymentProcessor.instance;
  }

  processPayment(payment: Payment): boolean {
    try {
      payment.processPayment();
      return payment.getStatus() === PaymentStatus.COMPLETED;
    } catch (err) {
      console.error("Payment processing error:", err);
      return false;
    }
  }

  refundPayment(payment: Payment): boolean {
    try {
      payment.refund();
      return payment.getStatus() === PaymentStatus.REFUNDED;
    } catch (err) {
      console.error("Refund processing error:", err);
      return false;
    }
  }
}
