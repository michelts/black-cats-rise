import type { Sector } from "@/types";

export function getSector(position: number) {
  return (Math.max(Math.min(Math.trunc(position / 33), 2), 0) - 1) as Sector;
}
