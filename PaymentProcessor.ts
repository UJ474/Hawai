import { Payment } from "./Payment";

export class PaymentProcessor {
    private static instance: PaymentProcessor;

    private constructor() {}

    static getInstance() : PaymentProcessor {
        if (!this.instance) {
            this.instance = new PaymentProcessor();
        }
        return this.instance;
    }

    processPayment(payment: Payment): void {
        const success = true;
        if (success) {
            payment.status = PaymentStatus.COMPLETED;
        } else {
            payment.status = PaymentStatus.FAILED;
        }
    }
}

enum PaymentStatus {
  PENDING,
  COMPLETED,
  FAILED
}