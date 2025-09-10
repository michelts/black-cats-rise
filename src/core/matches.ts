import type { EvenNumber, StoredMatch } from "@/types";

export function generateEmptyMatches(numTeams: EvenNumber): StoredMatch[] {
  const rounds = [];
  const teams = [...Array(numTeams).keys()];

  for (let round = 0; round < numTeams - 1; round++) {
    const matches = [];

    for (let i = 0; i < numTeams / 2; i++) {
      const pair = [teams[i], teams[numTeams - 1 - i]];
      if (pair[0] === undefined || pair[1] === undefined) {
        continue;
      }
      if (i === 0 && round >= numTeams / 2) {
        pair.reverse();
      }
      matches.push({
        id: getId(),
        teamIds: pair as [number, number],
        turns: [],
        goals: [0, 0] satisfies [number, number],
      });
    }

    rounds.push(matches);

    const rotate = teams.pop();
    if (rotate) {
      teams.splice(1, 0, rotate);
    }
  }

  rounds.sort(() => Math.random() - 0.5);
  return rounds.flatMap((matches, index) =>
    matches.map((match) => ({ ...match, round: index })),
  );
}

let id = 0;

function getId() {
  return ++id + "";
}
