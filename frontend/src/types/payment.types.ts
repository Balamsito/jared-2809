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

export interface PaymentResponse {
  id: string | null;
  status: PaymentStatus;
  status_detail: string;
  transaction_amount: number;
  date_created: string;
  authorization_code: string | null;
  reference: string | null;
  payer_id: string;
  payer_email: string;
}
