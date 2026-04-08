export class Payment {
    private readonly paymentId: string;
    private readonly paymentMethod: string;
    private readonly amount: number;
    status: PaymentStatus;

    constructor(paymentId: string, paymentMethod: string, amount: number) {
        this.paymentId = paymentId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.status = PaymentStatus.PENDING;
    }

    processPayment(): void {
        const success = true; // Simulating a successful payment
        if (success) {
            this.status = PaymentStatus.COMPLETED;
        } else {
            this.status = PaymentStatus.FAILED;
        }
    }

}

enum PaymentStatus {
  PENDING,
  COMPLETED,
  FAILED
}