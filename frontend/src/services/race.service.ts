import type { SnailWinStats, BetRecord, SnailProfile } from "../types/race.types";
import { SNAIL_NAMES } from "../types/race.types";

export const SNAIL_PROFILES: SnailProfile[] = [
  { id: 1, name: "Turbo Bolt",      color: "#00e701", odds: 2.45,  maxSpeed: 52, trend: +2.1,  points: 92, wins: 3 },
  { id: 2, name: "Shell Shocker",   color: "#06b6d4", odds: 3.80,  maxSpeed: 48, trend: -1.3,  points: 78, wins: 2 },
  { id: 3, name: "Neon Slimer",     color: "#8b5cf6", odds: 5.20,  maxSpeed: 45, trend: +0.8,  points: 62, wins: 1 },
  { id: 4, name: "Nitro Gastropod", color: "#f59e0b", odds: 7.50,  maxSpeed: 39, trend: +4.0,  points: 48, wins: 0 },
  { id: 5, name: "Cyber Mollusk",   color: "#ef4444", odds: 12.00, maxSpeed: 36, trend: -3.5,  points: 31, wins: 0 },
  { id: 6, name: "Hyper Escargot",  color: "#06b6d4", odds: 18.50, maxSpeed: 33, trend: +12.0, points: 15, wins: 0 },
];

/**
 * Distributes exactly 6 wins among 6 snails.
 * Guaranteed sum === 6 invariant.
 */
export function generateSnailWinStats(): SnailWinStats[] {
  const wins = Array(6).fill(0) as number[];
  for (let i = 0; i < 6; i++) {
    wins[Math.floor(Math.random() * 6)]++;
  }
  return SNAIL_PROFILES.map((snail, i) => ({
    snail: snail.name,
    wins: wins[i],
    color: snail.color,
  }));
}

/**
 * Generates mock bet history for donut chart and history panel.
 */
export function generateMockBets(): BetRecord[] {
  const bets: BetRecord[] = [];
  const count = 20 + Math.floor(Math.random() * 11);

  for (let i = 0; i < count; i++) {
    const betSnailIdx = Math.floor(Math.random() * 6);
    const winnerIdx = Math.floor(Math.random() * 6);
    const won = betSnailIdx === winnerIdx;
    const profile = SNAIL_PROFILES[betSnailIdx];
    const amount = (Math.floor(Math.random() * 20) + 1) * 100; // $1-$20

    bets.push({
      id: crypto.randomUUID(),
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      snailBetOn: SNAIL_NAMES[betSnailIdx],
      snailWinner: SNAIL_NAMES[winnerIdx],
      amount,
      odds: profile.odds,
      won,
      payout: won ? Math.round(amount * profile.odds) : 0,
    });
  }

  return bets.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
