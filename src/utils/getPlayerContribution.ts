import type { Position, Sector } from "@/types";

const contributions: Partial<
  Record<Sector, Partial<Record<Position | "", number>>>
> = {
  df: {
    df: 1,
    md: 0.3,
    at: 0.1,
  },
  md: {
    df: 0.3,
    md: 1,
    at: 0.3,
  },
  at: {
    df: 0.1,
    md: 0.3,
    at: 1,
  },
};

export function getPlayerContribution(
  sector: Sector,
  playerPosition: Position | "",
) {
  return contributions[sector]?.[playerPosition] ?? 0;
}
