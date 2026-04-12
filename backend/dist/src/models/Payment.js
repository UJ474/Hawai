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
        // UPI payment logic
        return true;
    }
}
export class CardPayment {
    pay(amount) {
        // Card payment logic
        return true;
    }
}
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
    processPayment() {
        // Basic implementation since processPayment delegates to strategy in Service
        // In actual implementation it might use strategy internally if passed here,
        // but the diagram shows PaymentService doing: processPayment(bookingId, strategy)
        return true;
    }
    // Getters
    getPaymentId() { return this.paymentId; }
    getBookingId() { return this.bookingId; }
    getAmount() { return this.amount; }
    getStatus() { return this.status; }
    getMethod() { return this.method; }
}
//# sourceMappingURL=Payment.js.map