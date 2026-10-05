import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { BalanceCard } from "../components/dashboard/BalanceCard";
import { DonutChart } from "../components/dashboard/DonutChart";
import { BarChart } from "../components/dashboard/BarChart";
import { RechargeModal } from "../components/dashboard/RechargeModal";
import { RaceLive } from "../components/dashboard/RaceLive";
import { Standings } from "../components/dashboard/Standings";
import { BetHistory } from "../components/dashboard/BetHistory";
import { generateMockBets, generateSnailWinStats } from "../services/race.service";
import type { BetRecord, SnailWinStats } from "../types/race.types";
import { useAuth } from "../context/AuthContext";
import { Flag, Radio, BarChart3, History } from "lucide-react";

type Tab = "live" | "analytics" | "history";

export function DashboardPage() {
  const { session } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [bets, setBets] = useState<BetRecord[]>([]);
  const [snailStats, setSnailStats] = useState<SnailWinStats[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("live");

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
            <div className="badge-live"><span className="badge-live-dot" />En Vivo</div>
          </div>
          <h2 className="welcome-title" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            Bienvenido, {session?.displayName}
            <Flag style={{ color: "var(--neon)", width: 22, height: 22 }} />
          </h2>
          <p className="welcome-subtitle">Derby Nocturno · Ronda 6/6 · Snail Stadium Beta</p>
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
            { key: "live", label: "Carrera En Vivo", Icon: Radio },
            { key: "analytics", label: "Analíticas", Icon: BarChart3 },
            { key: "history", label: "Historial", Icon: History },
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

        {/* ── Tab: Live Race ── */}
        {activeTab === "live" && (
          <div className="tab-content">
            <RaceLive />
            <Standings />
          </div>
        )}

        {/* ── Tab: Analytics ── */}
        {activeTab === "analytics" && (
          <div className="analytics-grid">
            <DonutChart bets={bets} />
            <BarChart stats={snailStats} />
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
