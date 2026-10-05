import { describe, it, expect } from "vitest";
import {
  generateSnailWinStats,
  generateMockBets,
  SNAIL_PROFILES,
} from "../../src/services/race.service";
import { SNAIL_NAMES } from "../../src/types/race.types";

describe("SNAIL_PROFILES constants", () => {
  it("has exactly 6 snail profiles", () => {
    expect(SNAIL_PROFILES).toHaveLength(6);
  });
  it("each profile has required fields", () => {
    for (const s of SNAIL_PROFILES) {
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("name");
      expect(s).toHaveProperty("color");
      expect(s).toHaveProperty("odds");
      expect(s).toHaveProperty("maxSpeed");
      expect(s).toHaveProperty("trend");
      expect(s).toHaveProperty("points");
      expect(s).toHaveProperty("wins");
      expect(s.odds).toBeGreaterThan(1);
      expect(s.maxSpeed).toBeGreaterThan(0);
    }
  });
  it("IDs are unique and 1-6", () => {
    const ids = SNAIL_PROFILES.map((s) => s.id);
    expect(new Set(ids).size).toBe(6);
    ids.forEach((id) => { expect(id).toBeGreaterThanOrEqual(1); expect(id).toBeLessThanOrEqual(6); });
  });
  it("sum of wins in SNAIL_PROFILES equals 6", () => {
    const total = SNAIL_PROFILES.reduce((acc, s) => acc + s.wins, 0);
    expect(total).toBe(6);
  });
});

describe("generateSnailWinStats", () => {
  it("returns exactly 6 entries", () => {
    expect(generateSnailWinStats()).toHaveLength(6);
  });
  it("total wins sum is exactly 6", () => {
    const stats = generateSnailWinStats();
    const total = stats.reduce((sum, s) => sum + s.wins, 0);
    expect(total).toBe(6);
  });
  it("each entry has a valid snail name", () => {
    const stats = generateSnailWinStats();
    for (const s of stats) {
      expect(SNAIL_NAMES).toContain(s.snail);
    }
  });
  it("wins are non-negative integers", () => {
    const stats = generateSnailWinStats();
    for (const s of stats) {
      expect(s.wins).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(s.wins)).toBe(true);
    }
  });
  it("constraint holds across 20 calls", () => {
    for (let i = 0; i < 20; i++) {
      const stats = generateSnailWinStats();
      const total = stats.reduce((sum, s) => sum + s.wins, 0);
      expect(total).toBe(6);
    }
  });
});

describe("generateMockBets", () => {
  it("returns between 20 and 30 bets", () => {
    const bets = generateMockBets();
    expect(bets.length).toBeGreaterThanOrEqual(20);
    expect(bets.length).toBeLessThanOrEqual(30);
  });
  it("all bets have required fields", () => {
    const bets = generateMockBets();
    for (const b of bets) {
      expect(b).toHaveProperty("id");
      expect(b).toHaveProperty("date");
      expect(b).toHaveProperty("won");
      expect(b).toHaveProperty("amount");
      expect(b).toHaveProperty("odds");
      expect(b).toHaveProperty("payout");
      expect(b.amount).toBeGreaterThan(0);
      expect(b.odds).toBeGreaterThan(1);
    }
  });
  it("bets are sorted descending by date", () => {
    const bets = generateMockBets();
    for (let i = 1; i < bets.length; i++) {
      const prev = new Date(bets[i - 1].date).getTime();
      const curr = new Date(bets[i].date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });
  it("won bets have payout > 0, lost bets have payout === 0", () => {
    const bets = generateMockBets();
    for (const b of bets) {
      if (b.won) expect(b.payout).toBeGreaterThan(0);
      else expect(b.payout).toBe(0);
    }
  });
});
