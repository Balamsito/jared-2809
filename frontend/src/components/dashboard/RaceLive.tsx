import { useState, useEffect, useCallback } from "react";
import { Zap, Check, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import type { SnailProfile } from "../../types/race.types";
import { SNAIL_PROFILES } from "../../services/race.service";
import { useBalance } from "../../hooks/useBalance";

type BetState = "idle" | "placing" | "confirmed" | "insufficient";

const RACE_DURATION = 60; // seconds per race cycle

function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(initial);
  const [phase, setPhase] = useState<"betting" | "racing" | "results">("betting");

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setPhase((p) => {
            if (p === "betting") return "racing";
            if (p === "racing") return "results";
            return "betting";
          });
          return initial;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [initial]);

  return { seconds, phase };
}

export function RaceLive() {
  const { balanceCents, addBalance } = useBalance();
  const { seconds, phase } = useCountdown(RACE_DURATION);

  const [selected, setSelected] = useState<SnailProfile | null>(null);
  const [stakeCents, setStakeCents] = useState(10000); // $100 default
  const [betState, setBetState] = useState<BetState>("idle");

  // Live odds fluctuation
  const [liveOdds, setLiveOdds] = useState<Record<number, number>>(
    Object.fromEntries(SNAIL_PROFILES.map((s) => [s.id, s.odds]))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOdds((prev) => {
        const next = { ...prev };
        SNAIL_PROFILES.forEach((s) => {
          const delta = (Math.random() - 0.48) * 0.05;
          next[s.id] = Math.max(1.1, +(prev[s.id] + delta).toFixed(2));
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const potentialReturn = selected
    ? ((stakeCents / 100) * liveOdds[selected.id]).toFixed(2)
    : "0.00";

  const handlePlaceBet = useCallback(() => {
    if (!selected) return;
    if (balanceCents < stakeCents) {
      setBetState("insufficient");
      setTimeout(() => setBetState("idle"), 2000);
      return;
    }
    setBetState("placing");
    // Deduct from balance
    addBalance(-stakeCents);
    setTimeout(() => {
      setBetState("confirmed");
      setTimeout(() => setBetState("idle"), 2500);
    }, 900);
  }, [selected, stakeCents, balanceCents, addBalance]);

  const setStake = (cents: number) => setStakeCents(cents);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const timeStr = `${mm}:${ss}`;

  const phaseLabel = phase === "betting" ? "Apuestas Abiertas" : phase === "racing" ? "¡En Carrera!" : "Resultados";
  const phaseColor = phase === "betting" ? "var(--neon)" : phase === "racing" ? "var(--cyan)" : "var(--amber)";

  return (
    <div className="race-panel">
      {/* ── Race Header ── */}
      <div className="race-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div className="badge-live">
              <span className="badge-live-dot" />
              En Vivo
            </div>
            <span className="race-event-tag">Derby Nocturno · Ronda 6/6 · Snail Stadium</span>
          </div>
          <h2 className="race-title">Selecciona tu Caracol</h2>
          <p className="race-subtitle">Elige y apuesta antes de que cierre la ventana</p>
        </div>
        <div className="race-timer-wrap">
          <div className="race-timer-label" style={{ color: phaseColor }}>
            {phaseLabel}
          </div>
          <div className="race-timer" id="race-timer" style={{ color: phaseColor }}>
            {timeStr}
          </div>
        </div>
      </div>

      {/* ── Snail Selection Grid ── */}
      <div className="snail-grid">
        {SNAIL_PROFILES.map((snail) => {
          const isSelected = selected?.id === snail.id;
          const odds = liveOdds[snail.id];
          const prevOdds = snail.odds;
          const trendUp = odds >= prevOdds;

          return (
            <button
              key={snail.id}
              id={`snail-btn-${snail.id}`}
              className={`snail-card${isSelected ? " snail-card-selected" : ""}`}
              style={isSelected ? { borderColor: snail.color, boxShadow: `0 0 16px ${snail.color}55` } : {}}
              onClick={() => setSelected(isSelected ? null : snail)}
              aria-pressed={isSelected}
              aria-label={`Apostar a ${snail.name}, cuota ${odds}`}
            >
              {/* Lane number badge */}
              <div className="snail-card-top">
                <span
                  className="snail-lane-badge"
                  style={{ background: snail.color, color: "#0a0f1d" }}
                >
                  {snail.id}
                </span>
                <span
                  className="snail-odds"
                  style={{ color: snail.color }}
                >
                  x{odds.toFixed(2)}
                </span>
              </div>

              <div className="snail-name">{snail.name}</div>

              <div className="snail-meta">
                <span className="snail-speed" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Zap style={{ width: 13, height: 13, color: "var(--amber)" }} />
                  {snail.maxSpeed} cm/s
                </span>
                <span
                  className="snail-trend"
                  style={{ color: trendUp ? "var(--neon)" : "var(--danger)" }}
                >
                  {trendUp ? <TrendingUp style={{ width: 13, height: 13 }} /> : <TrendingDown style={{ width: 13, height: 13 }} />} {Math.abs(snail.trend).toFixed(1)}%
                </span>
              </div>

              {isSelected && (
                <div className="snail-selected-badge" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Check style={{ width: 13, height: 13 }} /> Seleccionado
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Bet Execution Strip ── */}
      <div className="bet-strip">
        <div className="bet-strip-left">
          <span className="bet-strip-label">Monto de Apuesta:</span>
          <div className="stake-pills">
            {[5000, 10000, 25000, 50000].map((cents) => (
              <button
                key={cents}
                id={`stake-pill-${cents / 100}`}
                className={`stake-pill${stakeCents === cents ? " stake-pill-active" : ""}`}
                onClick={() => setStake(cents)}
              >
                ${(cents / 100).toFixed(0)}
              </button>
            ))}
            <button
              id="stake-pill-max"
              className={`stake-pill stake-pill-max${stakeCents === Math.min(balanceCents, 150000) ? " stake-pill-active" : ""}`}
              onClick={() => setStake(Math.min(balanceCents, 150000))}
            >
              MAX
            </button>
          </div>
          {/* Custom stake input */}
          <input
            id="stake-custom-input"
            type="number"
            className="stake-input"
            value={(stakeCents / 100).toFixed(0)}
            min={1}
            onChange={(e) => setStake(Math.round(parseFloat(e.target.value || "0") * 100))}
            aria-label="Monto personalizado"
          />
        </div>

        <div className="bet-strip-right">
          <div className="potential-return-wrap">
            <span className="potential-return-label">Retorno Estimado</span>
            <span className="potential-return" id="potential-return">
              ${potentialReturn} USD
            </span>
          </div>

          <button
            id="btn-place-bet"
            className={`btn-place-bet${!selected ? " btn-place-bet-disabled" : ""}`}
            onClick={handlePlaceBet}
            disabled={!selected || betState === "placing"}
            aria-label="Apostar ahora"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {betState === "placing" && <span className="btn-spinner" />}
            {betState === "confirmed" && <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Check style={{ width: 16, height: 16 }} /> ¡Apuesta Lista!</span>}
            {betState === "insufficient" && <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AlertCircle style={{ width: 16, height: 16 }} /> Saldo Insuficiente</span>}
            {betState === "idle" && (
              <>
                <Zap style={{ width: 16, height: 16 }} />
                <span>Apostar Ahora{selected ? ` — x${liveOdds[selected.id].toFixed(2)}` : ""}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
