import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { BalanceCard } from "../components/dashboard/BalanceCard";
import { DonutChart } from "../components/dashboard/DonutChart";
import { BarChart } from "../components/dashboard/BarChart";
import { RechargeModal } from "../components/dashboard/RechargeModal";
import { Standings } from "../components/dashboard/Standings";
import { SnailRoster } from "../components/dashboard/SnailRoster";
import { BetHistory } from "../components/dashboard/BetHistory";
import { generateMockBets, generateSnailWinStats } from "../services/race.service";
import type { BetRecord, SnailWinStats } from "../types/race.types";
import { useAuth } from "../context/AuthContext";
import { Flag, BarChart3, Trophy, History } from "lucide-react";

type Tab = "analytics" | "roster" | "history";

export function DashboardPage() {
  const { session } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [bets, setBets] = useState<BetRecord[]>([]);
  const [snailStats, setSnailStats] = useState<SnailWinStats[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("analytics");

  useEffect(() => {
    setBets(generateMockBets());
    setSnailStats(generateSnailWinStats());
  }, []);

  const won = bets.filter((b) => b.won).length;
  const lost = bets.filter((b) => !b.won).length;

  return (
    <div className="dashboard-layout">
      <Header onRecharge={() => setModalOpen(true)} />

      <main className="dashboard-main">
        {/* ── Welcome ── */}
        <div className="dashboard-welcome">
          <div className="welcome-eyebrow">
            <div className="badge-live"><span className="badge-live-dot" />Dashboard Oficial</div>
          </div>
          <h2 className="welcome-title" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            Bienvenido, {session?.displayName}
            <Flag style={{ color: "var(--neon)", width: 22, height: 22 }} />
          </h2>
          <p className="welcome-subtitle">Derby Nocturno · Monitoreo y Estadísticas Simuladas · Snail Stadium</p>
        </div>

        {/* ── Top row: Balance + mini stats ── */}
        <div className="top-row">
          <BalanceCard onRecharge={() => setModalOpen(true)} />
          <div className="mini-stats">
            <div className="mini-stat">
              <span className="mini-stat-label">Apuestas Ganadas</span>
              <span className="mini-stat-value" style={{ color: "var(--neon)" }}>{won}</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-label">Apuestas Perdidas</span>
              <span className="mini-stat-value" style={{ color: "var(--danger)" }}>{lost}</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-label">Win Rate</span>
              <span className="mini-stat-value" style={{ color: "var(--cyan)" }}>
                {bets.length ? Math.round((won / bets.length) * 100) : 0}%
              </span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-label">Total Apuestas</span>
              <span className="mini-stat-value">{bets.length}</span>
            </div>
          </div>
        </div>

        {/* ── Tab navigation ── */}
        <div className="tab-nav">
          {([
            { key: "analytics", label: "Analíticas y Gráficas", Icon: BarChart3 },
            { key: "roster", label: "Competidores Oficiales", Icon: Trophy },
            { key: "history", label: "Historial de Apuestas", Icon: History },
          ] as { key: Tab; label: string; Icon: React.ComponentType<{ style?: React.CSSProperties }> }[]).map(({ key, label, Icon }) => (
            <button
              key={key}
              id={`tab-${key}`}
              className={`tab-btn${activeTab === key ? " tab-btn-active" : ""}`}
              onClick={() => setActiveTab(key)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Icon style={{ width: 16, height: 16 }} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab: Analytics ── */}
        {activeTab === "analytics" && (
          <div className="tab-content">
            <div className="analytics-grid">
              <DonutChart bets={bets} />
              <BarChart stats={snailStats} />
            </div>
          </div>
        )}

        {/* ── Tab: Snail Roster ── */}
        {activeTab === "roster" && (
          <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SnailRoster />
            <Standings />
          </div>
        )}

        {/* ── Tab: History ── */}
        {activeTab === "history" && (
          <div className="tab-content">
            <BetHistory bets={bets} />
          </div>
        )}
      </main>

      <footer className="footer">
        <span className="footer-brand">TURBOSNAIL DERBY</span>
        <span className="footer-note">
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--neon)", display: "inline-block" }} />
          RNG Certificado · Provably Fair · 2025
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          <span className="footer-link">Reglas del Derby</span>
          <span className="footer-link">Juego Responsable</span>
        </div>
      </footer>

      <RechargeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
