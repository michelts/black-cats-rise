import { expect, it } from "vitest";
import type { Team } from "@/types";
import { Game } from "../game";
import { TeamFactory } from "./factories";

it("returns teams", () => {
  const teams: Team[] = TeamFactory.buildList(4);
  const storage: Record<string, unknown> = {
    teams,
  };
  const game = new Game(storage);
  expect(game.teams).toEqual(teams);
});
