import { Factory } from "fishery";
import { maxTurns } from "@/core/game";
import {
  PatternVertical,
  type Player,
  type StoredMatch,
  type StoredTeam,
  type StoredTurn,
} from "@/types";

export const TeamFactory = Factory.define<StoredTeam>(({ sequence }) => ({
  id: sequence,
  name: `Team ${sequence}`,
  nick: `Nick ${sequence}`,
  region: `Region ${sequence}`,
  kit: {
    color1: "red",
    color2: "black",
    pattern: PatternVertical,
  },
  formation: "4-4-2",
  players: [],
}));

class BasePlayerFactory extends Factory<Player> {
  gk(data: Omit<Player, "pos">) {
    return this.params({ ...data, pos: "gk" }).build();
  }

  df(data: Omit<Player, "pos">) {
    return this.params({ ...data, pos: "df" }).build();
  }

  md(data: Omit<Player, "pos">) {
    return this.params({ ...data, pos: "md" }).build();
  }

  at(data: Omit<Player, "pos">) {
    return this.params({ ...data, pos: "at" }).build();
  }
}

export const PlayerFactory = BasePlayerFactory.define(({ sequence }) => ({
  name: `Player ${sequence}`,
  number: sequence,
  gk: 2,
  df: 4,
  md: 6,
  at: 8,
}));

class BaseMatchFactory extends Factory<StoredMatch> {
  new(data: {
    round: number;
    teams: [number, number];
    goals?: [number, number];
    turns?: StoredTurn[];
  }) {
    const { round, teams, goals, turns } = data;
    return this.params({
      round: round,
      teamIds: [teams[0] ?? 0, teams[1] ?? 1],
      goals: goals ? [goals[0], goals[1]] : [0, 0],
      turns: turns ?? [],
    }).build();
  }

  completed(data: Parameters<typeof this.new>[0]) {
    return this.new({ ...data, turns: TurnFactory.buildList(maxTurns) });
  }
}

export const MatchFactory = BaseMatchFactory.define(({ sequence, params }) => {
  const { round, teamIds, turns } = params;
  return {
    id: `id-${sequence}`,
    round: round ?? 0,
    teamIds: teamIds ?? [0, 1],
    turns: turns ?? [],
    goals: [0, 0] satisfies [number, number],
  };
});

export const TurnFactory = Factory.define<StoredTurn>(() => {
  return {
    ballPosition: 50,
    time: 0,
  };
});
