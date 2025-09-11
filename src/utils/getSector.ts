import type { Sector } from "@/types";

export function getSector(position: number) {
  return (Math.max(Math.min(Math.trunc(position / 20), 4), 0) - 2) as Sector;
}
