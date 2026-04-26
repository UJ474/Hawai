export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (PaymentStatus = {}));
export var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["UPI"] = "UPI";
    PaymentMethod["CARD"] = "CARD";
})(PaymentMethod || (PaymentMethod = {}));
export class UPIPayment {
    pay(amount) {
        console.log(`[UPI] Processing payment of ₹${amount} via UPI gateway...`);
        return true;
    }
}
export class CardPayment {
    pay(amount) {
        console.log(`[Card] Processing payment of ₹${amount} via Payment Gateway (Stripe/Razorpay)...`);
        return true;
    }
}
export class PaymentFactory {
    static strategies = new Map();
    static register(method, strategy) {
        this.strategies.set(method, strategy);
    }
    static createStrategy(method) {
        const strategy = this.strategies.get(method);
        if (!strategy) {
            throw new Error(`Payment method ${method} not supported`);
        }
        return strategy;
    }
}
// Register all supported strategies at module load time
PaymentFactory.register(PaymentMethod.UPI, new UPIPayment());
PaymentFactory.register(PaymentMethod.CARD, new CardPayment());
export class Payment {
    paymentId;
    bookingId;
    amount;
    status;
    method;
    constructor(paymentId, bookingId, amount, status, method) {
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.amount = amount;
        this.status = status;
        this.method = method;
    }
    processPayment(strategy) {
        return strategy.pay(this.amount);
    }
    getPaymentId() { return this.paymentId; }
    getBookingId() { return this.bookingId; }
    getAmount() { return this.amount; }
    getStatus() { return this.status; }
    getMethod() { return this.method; }
}
//# sourceMappingURL=Payment.js.map