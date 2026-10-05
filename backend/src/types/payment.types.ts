export type PaymentStatus = "approved" | "rejected" | "error";

export interface PaymentRequest {
  card_number: string;
  expiration: string;
  cvv: string;
  card_holder: string;
  amount: number;
  payer_id: string;
  payer_email: string;
}

/**
 * SECURITY: card_number and cvv are intentionally NEVER included here.
 * This interface represents the only shape that ever leaves the server.
 */
export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  status_detail: string;
  transaction_amount: number;
  date_created: string;
  authorization_code: string | null;
  reference: string;
  payer_id: string;
  payer_email: string;
}
