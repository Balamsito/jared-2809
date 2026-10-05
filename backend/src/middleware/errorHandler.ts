import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[SnailPay] Unhandled error:", err.message);
  res.status(500).json({
    id: null,
    status: "error",
    status_detail: "internal_server_error",
    transaction_amount: 0,
    date_created: new Date().toISOString(),
    authorization_code: null,
    reference: null,
    payer_id: null,
    payer_email: null,
  });
}
