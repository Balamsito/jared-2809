import { Request, Response, NextFunction } from "express";

const CARD_REGEX = /^\d{16}$/;
const EXP_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CVV_REGEX = /^\d{3}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the shape of a PaymentRequest.
 * Does NOT perform business logic (e.g. card matching).
 */
export function validatePayment(req: Request, res: Response, next: NextFunction): void {
  const { card_number, expiration, cvv, card_holder, amount, payer_id, payer_email } = req.body;

  const missingFields = [];
  if (!card_number) missingFields.push("card_number");
  if (!expiration) missingFields.push("expiration");
  if (!cvv) missingFields.push("cvv");
  if (!card_holder) missingFields.push("card_holder");
  if (amount === undefined || amount === null) missingFields.push("amount");
  if (!payer_id) missingFields.push("payer_id");
  if (!payer_email) missingFields.push("payer_email");

  if (missingFields.length > 0) {
    res.status(400).json({
      id: null,
      status: "rejected",
      status_detail: "missing_required_fields",
      transaction_amount: 0,
      date_created: new Date().toISOString(),
      authorization_code: null,
      reference: null,
      payer_id: payer_id ?? null,
      payer_email: payer_email ?? null,
      missing: missingFields,
    });
    return;
  }

  if (!CARD_REGEX.test(card_number)) {
    res.status(400).json({
      id: null,
      status: "rejected",
      status_detail: "invalid_card_number",
      transaction_amount: 0,
      date_created: new Date().toISOString(),
      authorization_code: null,
      reference: null,
      payer_id,
      payer_email,
    });
    return;
  }

  if (!CVV_REGEX.test(cvv)) {
    res.status(400).json({
      id: null,
      status: "rejected",
      status_detail: "cc_rejected_bad_cvv",
      transaction_amount: 0,
      date_created: new Date().toISOString(),
      authorization_code: null,
      reference: null,
      payer_id,
      payer_email,
    });
    return;
  }

  if (!EXP_REGEX.test(expiration)) {
    res.status(400).json({
      id: null,
      status: "rejected",
      status_detail: "invalid_expiration_format",
      transaction_amount: 0,
      date_created: new Date().toISOString(),
      authorization_code: null,
      reference: null,
      payer_id,
      payer_email,
    });
    return;
  }

  if (!EMAIL_REGEX.test(payer_email)) {
    res.status(400).json({
      id: null,
      status: "rejected",
      status_detail: "invalid_payer_email",
      transaction_amount: 0,
      date_created: new Date().toISOString(),
      authorization_code: null,
      reference: null,
      payer_id,
      payer_email,
    });
    return;
  }

  if (typeof amount !== "number" || amount <= 0) {
    res.status(400).json({
      id: null,
      status: "rejected",
      status_detail: "invalid_amount",
      transaction_amount: 0,
      date_created: new Date().toISOString(),
      authorization_code: null,
      reference: null,
      payer_id,
      payer_email,
    });
    return;
  }

  next();
}
