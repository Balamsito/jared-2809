import { Zap, TrendingUp, TrendingDown, Award } from "lucide-react";
import { SNAIL_PROFILES } from "../../services/race.service";

export function SnailRoster() {
  return (
    <div className="card" id="snail-roster-container">
      <div className="chart-header" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span className="race-event-tag">Temporada Oficial 2025</span>
          </div>
          <h3 className="card-title" style={{ marginBottom: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Award style={{ width: 18, height: 18, color: "var(--neon)" }} />
            Competidores del Derby
          </h3>
          <p className="chart-subtitle" style={{ margin: "4px 0 0 0" }}>
            Perfiles de rendimiento y cuotas de referencia de los 6 caracoles oficiales.
          </p>
        </div>
      </div>

      <div className="snail-grid">
        {SNAIL_PROFILES.map((snail) => {
          const trendUp = snail.trend >= 0;

          return (
            <div
              key={snail.id}
              className="snail-card"
              style={{ cursor: "default" }}
            >
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
                  title="Cuota de referencia"
                >
                  x{snail.odds.toFixed(2)}
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
                  style={{ color: trendUp ? "var(--neon)" : "var(--danger)", display: "inline-flex", alignItems: "center", gap: 2 }}
                >
                  {trendUp ? <TrendingUp style={{ width: 13, height: 13 }} /> : <TrendingDown style={{ width: 13, height: 13 }} />}
                  {Math.abs(snail.trend).toFixed(1)}%
                </span>
              </div>

              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-faint)" }}>
                <span>Puntos: <strong style={{ color: "var(--text)" }}>{snail.points}</strong></span>
                <span>Victorias: <strong style={{ color: "var(--neon)" }}>{snail.wins}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
