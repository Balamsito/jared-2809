import { Target, Check, X } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { BetRecord } from "../../types/race.types";

interface DonutChartProps {
  bets: BetRecord[];
}

export function DonutChart({ bets }: DonutChartProps) {
  const won = bets.filter((b) => b.won).length;
  const lost = bets.filter((b) => !b.won).length;
  const total = won + lost;
  const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

  const data = [
    { name: "Ganadas", value: won },
    { name: "Perdidas", value: lost },
  ];

  if (bets.length === 0) {
    return (
      <div className="card chart-card">
        <h3 className="card-title">Apuestas</h3>
        <div className="chart-empty">Sin apuestas registradas.</div>
      </div>
    );
  }

  return (
    <div className="card chart-card" id="donut-chart-container">
      <div className="chart-header">
        <h3 className="card-title" style={{ marginBottom: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Target style={{ width: 18, height: 18, color: "var(--neon)" }} />
          Ganadas vs Perdidas
        </h3>
      </div>
      <div className="chart-stats">
        <span className="stat won" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {won} <Check style={{ width: 14, height: 14 }} />
        </span>
        <span className="stat-sep">·</span>
        <span className="stat lost" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {lost} <X style={{ width: 14, height: 14 }} />
        </span>
        <span className="win-rate">Win Rate: {winRate}%</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            <Cell fill="#00e701" />
            <Cell fill="#ef4444" />
          </Pie>
          <Tooltip
            formatter={(value) => [`${value ?? 0} apuestas`, ""]}
            contentStyle={{
              background: "#151e32",
              border: "1px solid rgba(51,65,85,0.6)",
              borderRadius: "8px",
              color: "#f1f5f9"
            }}
          />
          <Legend
            formatter={(val) => <span style={{ color: "#94a3b8", fontSize: 13 }}>{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
