import type { EvenNumber, StoredMatch } from "@/types";

export function generateEmptyMatches(numTeams: EvenNumber): StoredMatch[] {
  const rounds = [];
  const teams = [...Array(numTeams).keys()];

  for (let round = 0; round < numTeams - 1; round++) {
    const matches = [];

    for (let i = 0; i < numTeams / 2; i++) {
      const home = teams[i];
      const away = teams[numTeams - 1 - i];
      if (home !== undefined && away !== undefined) {
        matches.push({
          id: crypto.randomUUID(),
          home: { teamId: home },
          away: { teamId: away },
        });
      }
    }

    rounds.push(matches);

    const rotate = teams.pop();
    if (rotate) {
      teams.splice(0, 0, rotate);
    }
  }

  rounds.sort(() => Math.random() - 0.5);
  return rounds.flatMap((matches, index) =>
    matches.map((match) => ({ ...match, round: index })),
  );
}
