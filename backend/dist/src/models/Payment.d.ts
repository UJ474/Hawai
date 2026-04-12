export declare enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum PaymentMethod {
    UPI = "UPI",
    CARD = "CARD"
}
export interface PaymentStrategy {
    pay(amount: number): boolean;
}
export declare class UPIPayment implements PaymentStrategy {
    pay(amount: number): boolean;
}
export declare class CardPayment implements PaymentStrategy {
    pay(amount: number): boolean;
}
export declare class Payment {
    private paymentId;
    private bookingId;
    private amount;
    private status;
    private method;
    constructor(paymentId: string, bookingId: string, amount: number, status: PaymentStatus, method: PaymentMethod);
    processPayment(): boolean;
    getPaymentId(): string;
    getBookingId(): string;
    getAmount(): number;
    getStatus(): PaymentStatus;
    getMethod(): PaymentMethod;
}
//# sourceMappingURL=Payment.d.ts.map