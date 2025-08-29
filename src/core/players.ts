import type { Formation, Player, Position } from "@/types";

export function* makePlayers(
  formation: Formation,
  getPlayerName: () => string,
): Generator<Player> {
  const positions = ["df", "md", "at"] as const;
  const formationNumbers = formation.split("-").map((n) => Number(n));

  // Starting players
  yield makePlayer("gk", 1, getPlayerName);
  let number = 2;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < formationNumbers[i]; j++) {
      yield makePlayer(positions[i], number, getPlayerName);
      number++;
    }
  }

  // Reserve players
  yield makePlayer("gk", 12, getPlayerName);
  let reserve = 13;
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 6 - formationNumbers[i]; k++) {
      yield makePlayer(positions[i], reserve, getPlayerName);
      reserve++;
    }
  }
}

function makePlayer(
  pos: Position,
  number: number,
  getPlayerName: () => string,
) {
  return {
    name: getPlayerName(),
    number,
    pos,
    gk: getStat("gk", pos),
    df: getStat("df", pos),
    md: getStat("md", pos),
    at: getStat("at", pos),
  };
}

function getStat(desiredStat: Position, position: Position): number {
  const threshold = 0.66;
  if (desiredStat === position) {
    // Using power to reduce the chance or very large stats
    return threshold + Math.random() ** 3 * (1 - threshold);
  }
  return Math.random() * threshold;
}
