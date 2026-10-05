import { Request, Response } from "express";
import { buildResponse } from "../utils/responses";

const SUCCESS_CARD = "1234123412341234";
const SUCCESS_EXP = "12/26";
const SUCCESS_CVV = "543";

/**
 * Checks whether a MM/YY string has already expired.
 */
function isExpired(expiration: string): boolean {
  const [monthStr, yearStr] = expiration.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10);
  const now = new Date();
  const expDate = new Date(year, month - 1, 1);
  // Card is valid through the end of its expiry month
  return expDate < new Date(now.getFullYear(), now.getMonth(), 1);
}

export function processPayment(req: Request, res: Response): void {
  // SECURITY: destructure sensitive fields immediately; they must never
  // appear in any response body, log statement, or persistent storage.
  const { card_number, cvv, expiration, ...safeData } = req.body as {
    card_number: string;
    cvv: string;
    expiration: string;
    card_holder: string;
    amount: number;
    payer_id: string;
    payer_email: string;
  };

  const { amount, payer_id, payer_email } = safeData;

  // ── Scenario 3: Simulated system error (reproducible via header) ──
  if (req.headers["x-simulate-error"] === "true") {
    res.status(500).json(
      buildResponse("error", "internal_server_error", 0, payer_id, payer_email)
    );
    return;
  }

  // ── Expired card check ────────────────────────────────────────────
  if (isExpired(expiration)) {
    res.status(402).json(
      buildResponse("rejected", "cc_rejected_card_expired", amount, payer_id, payer_email)
    );
    return;
  }

  // ── Scenario 1: Approved ──────────────────────────────────────────
  if (
    card_number === SUCCESS_CARD &&
    expiration === SUCCESS_EXP &&
    cvv === SUCCESS_CVV
  ) {
    res.status(201).json(
      buildResponse("approved", "accredited", amount, payer_id, payer_email, true)
    );
    return;
  }

  // ── Scenario 2: Card declined (wrong card, wrong exp, or wrong cvv) ─
  res.status(402).json(
    buildResponse("rejected", "cc_rejected_other_reason", amount, payer_id, payer_email)
  );
}
