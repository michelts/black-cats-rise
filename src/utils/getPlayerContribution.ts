import type { Player, Position, Sector } from "@/types";

const contributions: Partial<
  Record<Sector, Partial<Record<Position | "", number>>>
> = {
  "-1": {
    df: 1,
    md: 0.3,
    at: 0.1,
  },
  0: {
    df: 0.3,
    md: 1,
    at: 0.3,
  },
  1: {
    df: 0.1,
    md: 0.3,
    at: 1,
  },
};

export function getPlayerContribution(sector: Sector, player: Player) {
  const value =
    sector === -1 ? player.df : sector === 0 ? player.md : player.at;
  return value * (contributions[sector]?.[player.pos ?? ""] ?? 0);
}
