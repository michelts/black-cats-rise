import { Factory } from "fishery";
import type { StoredMatch, StoredTeam } from "@/types";

export const TeamFactory = Factory.define<StoredTeam>(({ sequence }) => ({
  name: `Team ${sequence}`,
  nick: `Nick ${sequence}`,
  region: `Region ${sequence}`,
  kit: {
    color1: "red",
    color2: "black",
    pattern: "vertical",
  },
  mp: 0,
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
      home: {
        idx: teams[0] ?? 0,
      },
      away: {
        idx: teams[1] ?? 1,
      },
      goals: goals
        ? {
            home: goals[0],
            away: goals[1],
          }
        : undefined,
    }).build();
  }
}

export const MatchFactory = BaseMatchFactory.define(({ sequence, params }) => {
  const { round, home, away } = params;
  return {
    id: `id-${sequence}`,
    round: round ?? 0,
    home: home?.idx
      ? (home as StoredMatch["home"])
      : {
          idx: 0,
        },
    away: away?.idx
      ? (away as StoredMatch["away"])
      : {
          idx: 1,
        },
  };
});
