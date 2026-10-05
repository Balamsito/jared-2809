import { Trophy } from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { SnailWinStats } from "../../types/race.types";

interface BarChartProps {
  stats: SnailWinStats[];
}

export function BarChart({ stats }: BarChartProps) {
  const totalWins = stats.reduce((sum, s) => sum + s.wins, 0);
  const leader = stats.reduce((max, s) => s.wins > max.wins ? s : max, stats[0]);

  return (
    <div className="card chart-card" id="bar-chart-container">
      <div className="chart-header">
        <h3 className="card-title" style={{ marginBottom: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Trophy style={{ width: 18, height: 18, color: "var(--amber)" }} />
          Victorias por Caracol
        </h3>
      </div>
      <p className="chart-subtitle">
        6 carreras · Total: <strong style={{ color: "var(--neon)" }}>{totalWins}</strong> victorias
        {leader && leader.wins > 0 && (
          <> · Líder: <strong style={{ color: leader.color }}>{leader.snail}</strong></>
        )}
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <RechartsBarChart data={stats} margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.4)" vertical={false} />
          <XAxis
            dataKey="snail"
            tick={{ fill: "#475569", fontSize: 11, fontFamily: "Space Grotesk" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#475569", fontSize: 11 }}
            domain={[0, 6]}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value ?? 0}`, "Victorias"]}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              background: "#151e32",
              border: "1px solid rgba(51,65,85,0.6)",
              borderRadius: "8px",
              color: "#f1f5f9",
              fontFamily: "Space Grotesk"
            }}
          />
          <Bar dataKey="wins" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {stats.map((entry) => (
              <Cell
                key={entry.snail}
                fill={entry.color}
                style={{ filter: `drop-shadow(0 0 6px ${entry.color}55)` }}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
