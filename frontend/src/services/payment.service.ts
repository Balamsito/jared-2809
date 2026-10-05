import type { PaymentRequest, PaymentResponse } from "../types/payment.types";

const API_BASE = (import.meta as unknown as Record<string, Record<string, string>>).env?.VITE_API_URL ?? "http://localhost:3001";

export async function processPayment(
  payload: PaymentRequest,
  simulateError = false
): Promise<PaymentResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (simulateError) {
    headers["x-simulate-error"] = "true";
  }

  const response = await fetch(`${API_BASE}/api/payments`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as PaymentResponse;
  return data;
}
