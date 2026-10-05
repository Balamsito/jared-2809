import { useState, type FormEvent } from "react";
import { Zap, CheckCircle2, XCircle, AlertTriangle, FlaskConical, Lock, X } from "lucide-react";
import { processPayment } from "../../services/payment.service";
import { useAuth } from "../../context/AuthContext";
import type { PaymentResponse } from "../../types/payment.types";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalState = "idle" | "loading" | "success" | "error_rejected" | "error_system";

export function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
  const { session, addBalance } = useAuth();

  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [amount, setAmount] = useState("");
  const [simulateError, setSimulateError] = useState(false);

  const [modalState, setModalState] = useState<ModalState>("idle");
  const [response, setResponse] = useState<PaymentResponse | null>(null);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const formatCardNumber = (val: string) => val.replace(/\D/g, "").slice(0, 16);
  const formatExpiration = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  // Display card number with spaces every 4 digits
  const cardDisplay = cardNumber
    ? cardNumber.replace(/(.{4})/g, "$1 ").trim()
    : "•••• •••• •••• ••••";

  const validate = () => {
    if (!cardNumber || cardNumber.length !== 16) return "Número de tarjeta: 16 dígitos requeridos.";
    if (!expiration || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration)) return "Vencimiento inválido (MM/AA).";
    if (!cvv || cvv.length !== 3) return "CVV: 3 dígitos requeridos.";
    if (!cardHolder.trim()) return "Nombre del titular requerido.";
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return "El monto debe ser mayor a $0.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    const validationError = validate();
    if (validationError) { setFormError(validationError); return; }

    setModalState("loading");

    try {
      const result = await processPayment(
        {
          card_number: cardNumber,
          expiration,
          cvv,
          card_holder: cardHolder,
          amount: parseFloat(amount),
          payer_id: session?.userId ?? "",
          payer_email: session?.email ?? "",
        },
        simulateError
      );

      setResponse(result);

      if (result.status === "approved") {
        addBalance(Math.round(parseFloat(amount) * 100));
        setModalState("success");
      } else if (result.status === "error") {
        setModalState("error_system");
      } else {
        setModalState("error_rejected");
      }
    } catch {
      setModalState("error_system");
    }
  };

  const handleClose = () => {
    setModalState("idle");
    setResponse(null);
    setFormError("");
    setCardNumber("");
    setExpiration("");
    setCvv("");
    setCardHolder("");
    setAmount("");
    setSimulateError(false);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-brand" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Zap style={{ width: 20, height: 20, color: "var(--neon)" }} />
            <h2 id="modal-title" className="modal-title">SnailPay</h2>
            <span className="modal-badge">Seguro &amp; Instantáneo</span>
          </div>
          <button id="btn-modal-close" className="btn-icon" onClick={handleClose} aria-label="Cerrar modal"><X style={{ width: 18, height: 18 }} /></button>
        </div>

        {/* ── SUCCESS ── */}
        {modalState === "success" && response && (
          <div className="modal-result modal-result-success" id="payment-success">
            <div className="result-icon" style={{ display: "flex", justifyContent: "center" }}>
              <CheckCircle2 style={{ width: 48, height: 48, color: "var(--neon)" }} />
            </div>
            <h3>¡Depósito Acreditado!</h3>
            <p>Tu saldo fue actualizado instantáneamente.</p>
            <div className="result-details">
              <div className="result-row">
                <span>Monto</span>
                <strong className="result-neon">${response.transaction_amount.toFixed(2)} USD</strong>
              </div>
              <div className="result-row">
                <span>Auth Code</span>
                <strong>{response.authorization_code}</strong>
              </div>
              <div className="result-row">
                <span>Referencia</span>
                <code>{response.reference}</code>
              </div>
              <div className="result-row">
                <span>ID</span>
                <code style={{ fontSize: 10 }}>{response.id?.slice(0, 24)}...</code>
              </div>
            </div>
            <button id="btn-close-success" className="btn btn-primary btn-full" onClick={handleClose} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Zap style={{ width: 16, height: 16 }} /> Continuar al Derby
            </button>
          </div>
        )}

        {/* ── REJECTED ── */}
        {modalState === "error_rejected" && response && (
          <div className="modal-result modal-result-error" id="payment-rejected">
            <div className="result-icon" style={{ display: "flex", justifyContent: "center" }}>
              <XCircle style={{ width: 48, height: 48, color: "var(--danger)" }} />
            </div>
            <h3>Transacción Rechazada</h3>
            <p className="result-detail-code">{response.status_detail}</p>
            <p className="result-hint">Verifica los datos de tu tarjeta e intenta de nuevo.</p>
            <button id="btn-retry-payment" className="btn btn-secondary btn-full" onClick={() => setModalState("idle")}>
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* ── SYSTEM ERROR ── */}
        {modalState === "error_system" && (
          <div className="modal-result modal-result-warning" id="payment-system-error">
            <div className="result-icon" style={{ display: "flex", justifyContent: "center" }}>
              <AlertTriangle style={{ width: 48, height: 48, color: "var(--amber)" }} />
            </div>
            <h3>Error del Sistema</h3>
            <p>No se procesó ningún cargo. El saldo permanece intacto.</p>
            <button id="btn-retry-system-error" className="btn btn-secondary btn-full" onClick={() => setModalState("idle")}>
              Reintentar
            </button>
          </div>
        )}

        {/* ── FORM ── */}
        {(modalState === "idle" || modalState === "loading") && (
          <form className="modal-form" onSubmit={handleSubmit} noValidate>

            {/* Card Preview */}
            <div className="card-preview">
              <span className="card-preview-number">{cardDisplay}</span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "Space Grotesk", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Titular
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontFamily: "Space Grotesk", fontWeight: 600 }}>
                    {cardHolder || "NOMBRE TITULAR"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "Space Grotesk", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Vence
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontFamily: "monospace" }}>
                    {expiration || "MM/AA"}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="card-number" className="form-label">Número de Tarjeta</label>
              <input
                id="card-number"
                type="text"
                inputMode="numeric"
                className="form-input"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
                disabled={modalState === "loading"}
              />
            </div>

            <div className="form-row form-row-2">
              <div className="form-group">
                <label htmlFor="card-expiration" className="form-label">Vencimiento</label>
                <input
                  id="card-expiration"
                  type="text"
                  inputMode="numeric"
                  className="form-input"
                  value={expiration}
                  onChange={(e) => setExpiration(formatExpiration(e.target.value))}
                  placeholder="MM/AA"
                  maxLength={5}
                  disabled={modalState === "loading"}
                />
              </div>
              <div className="form-group">
                <label htmlFor="card-cvv" className="form-label">CVV</label>
                <input
                  id="card-cvv"
                  type="text"
                  inputMode="numeric"
                  className="form-input"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  placeholder="•••"
                  maxLength={3}
                  disabled={modalState === "loading"}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="card-holder" className="form-label">Nombre del Titular</label>
              <input
                id="card-holder"
                type="text"
                className="form-input"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                placeholder="COMO APARECE EN LA TARJETA"
                disabled={modalState === "loading"}
              />
            </div>

            {/* Quick amount pills */}
            <div className="form-group">
              <label htmlFor="payment-amount" className="form-label">Monto a Depositar (USD)</label>
              <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                {[50, 100, 200, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={amount === String(amt) ? { borderColor: "var(--neon)", color: "var(--neon)", boxShadow: "0 0 8px rgba(0,231,1,0.2)" } : {}}
                    onClick={() => setAmount(String(amt))}
                    disabled={modalState === "loading"}
                    id={`quick-amount-${amt}`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <input
                id="payment-amount"
                type="number"
                min="1"
                step="0.01"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                disabled={modalState === "loading"}
              />
            </div>

            {formError && (
              <div className="alert alert-error" role="alert" id="payment-form-error">
                {formError}
              </div>
            )}

            <label className="dev-toggle" htmlFor="simulate-error-toggle">
              <input
                id="simulate-error-toggle"
                type="checkbox"
                checked={simulateError}
                onChange={(e) => setSimulateError(e.target.checked)}
                disabled={modalState === "loading"}
              />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <FlaskConical style={{ width: 14, height: 14 }} /> Simular error del sistema (dev)
              </span>
            </label>

            <button
              id="btn-submit-payment"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={modalState === "loading"}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <Zap style={{ width: 16, height: 16 }} />
              {modalState === "loading"
                ? "Procesando con SnailPay..."
                : `Confirmar Depósito${amount ? ` — $${parseFloat(amount || "0").toFixed(2)} USD` : ""}`}
            </button>

            <p className="modal-security-note" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Lock style={{ width: 13, height: 13 }} /> Encriptación de extremo a extremo. Datos de tarjeta nunca almacenados.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
