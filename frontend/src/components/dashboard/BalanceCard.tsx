import { useBalance } from "../../hooks/useBalance";
import { Wallet, Zap } from "lucide-react";

interface BalanceCardProps {
  onRecharge: () => void;
}

export function BalanceCard({ onRecharge }: BalanceCardProps) {
  const { balanceFormatted } = useBalance();

  return (
    <div className="card balance-card">
      <div className="balance-card-header">
        <div className="balance-card-icon" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Wallet style={{ width: 18, height: 18, color: "var(--neon)" }} />
          <span>Saldo Total</span>
        </div>
        <div className="badge-live">
          <span className="badge-live-dot" />
          Live
        </div>
      </div>

      <div>
        <span className="balance-amount-large" id="balance-display">{balanceFormatted}</span>
        <span className="balance-currency">USD · Disponible</span>
      </div>

      <button
        id="btn-open-recharge"
        className="btn btn-primary btn-full"
        onClick={onRecharge}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <Zap style={{ width: 16, height: 16 }} /> Depositar con SnailPay
      </button>
    </div>
  );
}
