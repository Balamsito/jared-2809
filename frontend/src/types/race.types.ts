export type SnailName = "Turbo Bolt" | "Shell Shocker" | "Neon Slimer" | "Nitro Gastropod" | "Cyber Mollusk" | "Hyper Escargot";

export const SNAIL_NAMES: SnailName[] = [
  "Turbo Bolt", "Shell Shocker", "Neon Slimer",
  "Nitro Gastropod", "Cyber Mollusk", "Hyper Escargot"
];

export interface SnailProfile {
  id: number;
  name: SnailName;
  color: string;        // lane color
  odds: number;         // e.g. 2.45
  maxSpeed: number;     // cm/s
  trend: number;        // % odds movement (positive = going up)
  points: number;       // seasonal points
  wins: number;         // out of 6 races
}

export interface BetRecord {
  id: string;
  date: string;
  snailBetOn: SnailName;
  snailWinner: SnailName;
  amount: number;       // cents
  odds: number;
  won: boolean;
  payout: number;       // cents
}

export interface SnailWinStats {
  snail: SnailName;
  wins: number;
  color: string;
}

export interface ActiveBet {
  snail: SnailProfile | null;
  stakeCents: number;   // cents
}
