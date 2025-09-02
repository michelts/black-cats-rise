import type { Match, Team } from "@/types";

export function getTable(
  teams: Array<Pick<Team, "id" | "name">>,
  matches: Array<Pick<Match, "teamIds" | "goals" | "isDone">>,
) {
  const table = teams.map((team) => ({
    id: team.id,
    name: team.name,
    mp: 0,
    w: 0,
    d: 0,
    l: 0,
    f: 0,
    a: 0,
    gd: 0,
    pts: 0,
  }));
  for (const match of matches) {
    const {
      teamIds: [home, away],
      goals,
      isDone,
    } = match;
    if (!isDone) {
      continue;
    }
    table[home].mp += 1;
    table[away].mp += 1;
    if (goals[0] > goals[1]) {
      table[home].w += 1;
      table[away].l += 1;
      table[home].pts += 3;
    } else if (goals[0] < goals[1]) {
      table[home].l += 1;
      table[away].w += 1;
      table[away].pts += 3;
    } else {
      table[home].d += 1;
      table[away].d += 1;
      table[home].pts += 1;
      table[away].pts += 1;
    }

    table[home].f += goals[0];
    table[home].a += goals[1];
    table[home].gd += goals[0] - goals[1];
    table[away].f += goals[1];
    table[away].a += goals[0];
    table[away].gd += goals[1] - goals[0];
  }
  table.sort((a, b) => {
    if (a.pts !== b.pts) {
      return b.pts - a.pts;
    }
    if (a.gd !== b.gd) {
      return b.gd - a.gd;
    }
    if (a.f !== b.f) {
      return b.f - a.f;
    }
    return a.a - b.a;
  });
  return table;
}
