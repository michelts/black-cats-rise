import { expect, it } from "vitest";
import type { StoredTeam } from "@/types";
import { Game } from "../game";
import { MatchFactory, TeamFactory } from "./factories";

it("returns teams with all empty values on initial condition", () => {
  const teams: StoredTeam[] = TeamFactory.buildList(4);
  const matches = [
    MatchFactory.new({ round: 0, teams: [0, 1] }),
    MatchFactory.new({ round: 0, teams: [2, 3] }),
    MatchFactory.new({ round: 1, teams: [0, 2] }),
    MatchFactory.new({ round: 1, teams: [1, 3] }),
    MatchFactory.new({ round: 2, teams: [0, 3] }),
    MatchFactory.new({ round: 2, teams: [1, 2] }),
  ];
  const storage: Record<string, unknown> = {
    currentDate: Date.now(),
    teams,
    matches,
  };
  const game = new Game(storage);
  const [a, b, c, d] = teams;
  expect(game.teams).toEqual([
    { ...a, mp: 0, w: 0, d: 0, l: 0, f: 0, a: 0, gd: 0, pts: 0 },
    { ...b, mp: 0, w: 0, d: 0, l: 0, f: 0, a: 0, gd: 0, pts: 0 },
    { ...c, mp: 0, w: 0, d: 0, l: 0, f: 0, a: 0, gd: 0, pts: 0 },
    { ...d, mp: 0, w: 0, d: 0, l: 0, f: 0, a: 0, gd: 0, pts: 0 },
  ]);
});

it.only("returns teams with point, goals and other stats after matches have been played", () => {
  const teams: StoredTeam[] = TeamFactory.buildList(4);
  const matches = [
    MatchFactory.new({ round: 0, teams: [0, 1], goals: [1, 0] }),
    MatchFactory.new({ round: 0, teams: [2, 3], goals: [5, 1] }),
    MatchFactory.new({ round: 1, teams: [0, 2], goals: [3, 3] }),
    MatchFactory.new({ round: 1, teams: [1, 3] }),
    MatchFactory.new({ round: 2, teams: [0, 3] }),
    MatchFactory.new({ round: 2, teams: [1, 2] }),
  ];
  const storage: Record<string, unknown> = {
    currentDate: Date.now(),
    teams,
    matches,
  };
  const game = new Game(storage);
  const [a, b, c, d] = teams;
  expect(game.teams).toEqual([
    { ...a, mp: 2, w: 1, d: 1, l: 0, f: 4, a: 3, gd: 1, pts: 4 },
    { ...b, mp: 1, w: 0, d: 0, l: 1, f: 0, a: 1, gd: -1, pts: 0 },
    { ...c, mp: 2, w: 1, d: 1, l: 0, f: 8, a: 4, gd: 4, pts: 4 },
    { ...d, mp: 1, w: 0, d: 0, l: 1, f: 1, a: 5, gd: -4, pts: 0 },
  ]);
});
