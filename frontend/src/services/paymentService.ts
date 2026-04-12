const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export enum PaymentMethod {
  UPI = "UPI",
  CARD = "CARD",
}

export interface Payment {
  paymentId: string;
  bookingId: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  method: PaymentMethod;
}

export const paymentService = {
  async processPayment(
    bookingId: string,
    method: PaymentMethod,
    amount: number
  ): Promise<Payment> {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ bookingId, method, amount }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to process payment");
    }
    return response.json();
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch(`${API_BASE_URL}/payments/methods`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch payment methods");
    }
    return response.json();
  },

  // Refund functionality might be for admin or specific user cases,
  // not directly exposed to regular users in typical flow.
  // async refundPayment(paymentId: string): Promise<Payment> {
  //   const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/refund`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   });
  //   if (!response.ok) {
  //     throw new Error("Failed to refund payment");
  //   }
  //   return response.json();
  // },
};
