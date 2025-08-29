import type { Formation } from "@/types";
import { shuffle } from "@/utils/shuffle";

export function getFormation() {
  return shuffle([...formations])[0];
}

export const formations: Formation[] = [
  "3-5-2",
  "3-4-3",
  "3-3-4",
  "4-3-3",
  "4-4-2",
  "4-3-4",
  "5-3-2",
  "5-4-1",
  "5-2-3",
  "6-3-1",
  "6-2-2",
];
