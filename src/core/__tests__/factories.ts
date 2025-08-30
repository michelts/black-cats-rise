import { Factory } from "fishery";
import type { StoredMatch, StoredTeam } from "@/types";

export const TeamFactory = Factory.define<StoredTeam>(({ sequence }) => ({
  id: sequence,
  name: `Team ${sequence}`,
  nick: `Nick ${sequence}`,
  region: `Region ${sequence}`,
  kit: {
    color1: "red",
    color2: "black",
    pattern: "vertical",
  },
  formation: "4-4-2",
  players: [],
}));

class BaseMatchFactory extends Factory<StoredMatch> {
  new(data: {
    round: number;
    teams: [number, number];
    goals?: [number, number];
  }) {
    const { round, teams, goals } = data;
    return this.params({
      round: round,
      teamIds: [teams[0] ?? 0, teams[1] ?? 1],
      goals: goals ? [goals[0], goals[1]] : undefined,
    }).build();
  }
}

export const MatchFactory = BaseMatchFactory.define(({ sequence, params }) => {
  const { round, teamIds } = params;
  return {
    id: `id-${sequence}`,
    round: round ?? 0,
    teamIds: teamIds ?? [0, 1],
  };
});
