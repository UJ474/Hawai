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
    // UPI payment logic
    return true;
  }
}

export class CardPayment implements PaymentStrategy {
  public pay(amount: number): boolean {
    // Card payment logic
    return true;
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

  public processPayment(): boolean {
    // Basic implementation since processPayment delegates to strategy in Service
    // In actual implementation it might use strategy internally if passed here,
    // but the diagram shows PaymentService doing: processPayment(bookingId, strategy)
    return true;
  }

  // Getters
  public getPaymentId(): string { return this.paymentId; }
  public getBookingId(): string { return this.bookingId; }
  public getAmount(): number { return this.amount; }
  public getStatus(): PaymentStatus { return this.status; }
  public getMethod(): PaymentMethod { return this.method; }
}
