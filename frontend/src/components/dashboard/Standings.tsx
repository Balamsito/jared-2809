import { SNAIL_PROFILES } from "../../services/race.service";
import { Trophy, Medal } from "lucide-react";

export function Standings() {
  // Sort by points desc
  const sorted = [...SNAIL_PROFILES].sort((a, b) => b.points - a.points);
  const maxPoints = sorted[0].points;

  const renderRankIcon = (idx: number) => {
    if (idx === 0) return <Medal style={{ width: 18, height: 18, color: "#fbbf24" }} />; // Gold
    if (idx === 1) return <Medal style={{ width: 18, height: 18, color: "#94a3b8" }} />; // Silver
    if (idx === 2) return <Medal style={{ width: 18, height: 18, color: "#d97706" }} />; // Bronze
    return <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b", width: 18, textAlign: "center" }}>{idx + 1}</span>;
  };

  return (
    <div className="card" id="standings-container">
      <div className="chart-header">
        <h3 className="card-title" style={{ marginBottom: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Trophy style={{ width: 18, height: 18, color: "var(--amber)" }} />
          Clasificación del Derby
        </h3>
        <span className="race-event-tag">Temporada 2025 · Ronda Neo</span>
      </div>
      <p className="chart-subtitle">Puntos acumulados en las 6 carreras oficiales de hoy</p>

      <div className="standings-list">
        {sorted.map((snail, idx) => {
          const barWidth = Math.round((snail.points / maxPoints) * 100);
          return (
            <div key={snail.id} className="standing-row">
              <span className="standing-rank" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {renderRankIcon(idx)}
              </span>
              <div className="standing-info">
                <div className="standing-name-row">
                  <span
                    className="standing-dot"
                    style={{ background: snail.color, boxShadow: `0 0 6px ${snail.color}` }}
                  />
                  <span className="standing-name">{snail.name}</span>
                  <span className="standing-wins">{snail.wins}V</span>
                </div>
                <div className="standing-bar-track">
                  <div
                    className="standing-bar-fill"
                    style={{
                      width: `${barWidth}%`,
                      background: snail.color,
                      boxShadow: `0 0 8px ${snail.color}55`,
                    }}
                  />
                </div>
              </div>
              <span className="standing-pts" style={{ color: snail.color }}>
                {snail.points} pts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
