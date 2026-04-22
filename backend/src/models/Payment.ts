export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  UPI = "UPI",
  CARD = "CARD",
}

export interface PaymentStrategy {
  pay(amount: number): boolean;
}

export class UPIPayment implements PaymentStrategy {
  public pay(amount: number): boolean {
    console.log(`[UPI] Processing payment of ₹${amount} via UPI gateway...`);
    // Simulated UPI logic: In a real app, this would call a UPI intent/callback API
    return true;
  }
}

export class CardPayment implements PaymentStrategy {
  public pay(amount: number): boolean {
    console.log(`[Card] Processing payment of ₹${amount} via Payment Gateway (Stripe/Razorpay)...`);
    // Simulated Card logic: In a real app, this would involve tokenization and PCI-DSS compliant processing
    return true;
  }
}

export class PaymentFactory {
  public static createStrategy(method: PaymentMethod): PaymentStrategy {
    switch (method) {
      case PaymentMethod.UPI:
        return new UPIPayment();
      case PaymentMethod.CARD:
        return new CardPayment();
      default:
        throw new Error(`Payment method ${method} not supported`);
    }
  }
}

export class Payment {
  private paymentId: string;
  private bookingId: string;
  private amount: number;
  private status: PaymentStatus;
  private method: PaymentMethod;

  constructor(
    paymentId: string,
    bookingId: string,
    amount: number,
    status: PaymentStatus,
    method: PaymentMethod
  ) {
    this.paymentId = paymentId;
    this.bookingId = bookingId;
    this.amount = amount;
    this.status = status;
    this.method = method;
  }

  public processPayment(strategy: PaymentStrategy): boolean {
    return strategy.pay(this.amount);
  }

  // Getters
  public getPaymentId(): string { return this.paymentId; }
  public getBookingId(): string { return this.bookingId; }
  public getAmount(): number { return this.amount; }
  public getStatus(): PaymentStatus { return this.status; }
  public getMethod(): PaymentMethod { return this.method; }
}
