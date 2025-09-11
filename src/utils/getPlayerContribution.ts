import type { Player, Position, Sector } from "@/types";

const contributions: Partial<
  Record<Sector, Partial<Record<Position | "", number>>>
> = {
  "-2": {
    df: 1,
    md: 0.3,
    at: 0.1,
  },
  "-1": {
    df: 1,
    md: 0.5,
    at: 0.2,
  },
  0: {
    df: 0.5,
    md: 1,
    at: 0.5,
  },
  1: {
    df: 0.2,
    md: 0.5,
    at: 1,
  },
  2: {
    df: 0.1,
    md: 0.4,
    at: 1.2,
  },
};

export function getPlayerContribution(
  sector: Sector,
  player: Player,
  hasBoost: number,
) {
  const value = sector < 0 ? player.df : sector > 0 ? player.at : player.md;
  const boost = hasBoost ? 1.5 : 1; // boostContribution
  return value * (contributions[sector]?.[player.pos ?? ""] ?? 0) * boost;
}
