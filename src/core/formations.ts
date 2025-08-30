import type { Formation, Position } from "@/types";
import { shuffle } from "@/utils/shuffle";

export function getFormation() {
  return shuffle([...formations])[0];
}

export function adjustIntoPosition<T extends Array<object>>(
  list: T,
  formation: Formation,
) {
  const positions = makePositionsFromFormation(formation);
  return list.map((item, index) => ({ ...item, pos: positions[index] }));
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

function makePositionsFromFormation(formation: Formation) {
  const positions: Position[] = ["df", "md", "at"];
  return [
    "gk",
    ...formation.split("-").flatMap((count, index) => {
      return Array(Number(count)).fill(positions[index]);
    }),
  ];
}
