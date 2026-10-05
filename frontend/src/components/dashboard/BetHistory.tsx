import { ClipboardList } from "lucide-react";
import type { BetRecord } from "../../types/race.types";

interface BetHistoryProps {
  bets: BetRecord[];
}

export function BetHistory({ bets }: BetHistoryProps) {
  const recent = bets.slice(0, 10);

  return (
    <div className="card" id="bet-history-container">
      <div className="chart-header">
        <h3 className="card-title" style={{ marginBottom: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <ClipboardList style={{ width: 18, height: 18, color: "var(--cyan)" }} />
          Historial de Apuestas
        </h3>
        <span className="race-event-tag">Últimas {recent.length}</span>
      </div>

      <div className="history-table">
        <div className="history-header">
          <span>Caracol</span>
          <span>Ganador</span>
          <span>Cuota</span>
          <span>Monto</span>
          <span>Resultado</span>
        </div>

        {recent.map((bet) => (
          <div key={bet.id} className={`history-row${bet.won ? " history-row-won" : " history-row-lost"}`}>
            <span className="history-snail">{bet.snailBetOn}</span>
            <span className="history-winner" style={{ color: "var(--text-muted)", fontSize: 12 }}>
              {bet.snailWinner}
            </span>
            <span className="history-odds">x{bet.odds.toFixed(2)}</span>
            <span className="history-amount">${(bet.amount / 100).toFixed(2)}</span>
            <span className={bet.won ? "history-won" : "history-lost"}>
              {bet.won
                ? `+$${(bet.payout / 100).toFixed(2)}`
                : `-$${(bet.amount / 100).toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
