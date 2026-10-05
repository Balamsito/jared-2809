import { v4 as uuidv4 } from "uuid";
import { PaymentResponse, PaymentStatus } from "../types/payment.types";

/**
 * Generates a random 6-char alphanumeric authorization code
 */
function generateAuthCode(): string {
  return "SNP-" + Math.random().toString(36).toUpperCase().slice(2, 8);
}

/**
 * Generates a reference string tied to current date
 */
function generateReference(): string {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `REF-${date}-${uuidv4().split("-")[0]}`;
}

export function buildResponse(
  status: PaymentStatus,
  status_detail: string,
  amount: number,
  payer_id: string,
  payer_email: string,
  approved = false
): PaymentResponse {
  return {
    id: `pay_${uuidv4()}`,
    status,
    status_detail,
    transaction_amount: amount,
    date_created: new Date().toISOString(),
    authorization_code: approved ? generateAuthCode() : null,
    reference: generateReference(),
    payer_id,
    payer_email,
  };
}
