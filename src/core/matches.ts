import type { EvenNumber, Match } from "@/types";

export function generateEmptyMatches(numTeams: EvenNumber): Match[] {
  const rounds = [];
  const teams = [...Array(numTeams).keys()];

  for (let round = 0; round < numTeams - 1; round++) {
    const matches = [];

    for (let i = 0; i < numTeams / 2; i++) {
      const home = teams[i];
      const away = teams[numTeams - 1 - i];
      if (home !== undefined && away !== undefined) {
        matches.push({ home: { teamId: home }, away: { teamId: away } });
      }
    }

    rounds.push(matches);

    // rotate (except the first team)
    teams.splice(0, 0, teams.pop());
  }

  rounds.sort(() => Math.random() - 0.5);
  return rounds.flatMap((matches, index) =>
    matches.map((match) => ({ ...match, round: index })),
  );
}
