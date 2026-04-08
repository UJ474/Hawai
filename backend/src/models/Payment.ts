export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  NET_BANKING = "NET_BANKING",
  UPI = "UPI",
  WALLET = "WALLET",
}

export class Payment {
  private readonly paymentId: string;
  private readonly paymentMethod: PaymentMethod;
  private readonly amount: number;
  private readonly bookingId: string;
  private status: PaymentStatus;

  constructor(
    paymentId: string,
    paymentMethod: PaymentMethod,
    amount: number,
    bookingId: string
  ) {
    this.paymentId = paymentId;
    this.paymentMethod = paymentMethod;
    this.amount = amount;
    this.bookingId = bookingId;
    this.status = PaymentStatus.PENDING;
  }

  getPaymentId(): string {
    return this.paymentId;
  }

  getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  getAmount(): number {
    return this.amount;
  }

  getBookingId(): string {
    return this.bookingId;
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  processPayment(): void {
    // Simulates gateway call — replace with real integration as needed
    const success = true;
    this.status = success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
  }

  refund(): void {
    if (this.status === PaymentStatus.COMPLETED) {
      this.status = PaymentStatus.REFUNDED;
    }
  }
}
