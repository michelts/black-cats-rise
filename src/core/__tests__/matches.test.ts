import { range } from "@/utils/range";
import { expect, it } from "vitest";
import type { StoredMatch } from "@/types";
import { generateEmptyMatches } from "../matches";

it("generates matches", () => {
  const teamsCount = 6;
  const matches = generateEmptyMatches(teamsCount);
  expect(matches).toHaveLength(15);
  expect(getCount(matches, teamsCount, "home")).toEqual([3, 2, 2, 2, 3, 3]);
  expect(getCount(matches, teamsCount, "away")).toEqual([2, 3, 3, 3, 2, 2]);
  for (let i = 0; i < teamsCount - 1; i++) {
    const roundMatches = matches.filter((match) => match.round === i);
    expect(roundMatches).toHaveLength(3);
    const teams = new Set(
      roundMatches.flatMap((match) => [match.home.teamId, match.away.teamId]),
    );
    expect(teams).toHaveLength(6); // make sure there's not repeating inside the round
  }
  for (let i = 0; i < teamsCount; i++) {
    const teamRounds = matches
      .filter((match) => match.home.teamId === i || match.away.teamId === i)
      .map((match) => match.round);
    expect(teamRounds).toEqual(range(5)); // ensure index are sorted
  }
});

it("generates matches with 20 teams", () => {
  const teamsCount = 20;
  const matches = generateEmptyMatches(teamsCount);
  expect(matches).toHaveLength(190);
  expect(getCount(matches, teamsCount, "home")).toEqual([
    10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  ]);
  expect(getCount(matches, teamsCount, "away")).toEqual([
    9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9,
  ]);
  for (let i = 0; i < teamsCount - 1; i++) {
    const roundMatches = matches.filter((match) => match.round === i);
    expect(roundMatches).toHaveLength(10);
    const teams = new Set(
      roundMatches.flatMap((match) => [match.home.teamId, match.away.teamId]),
    );
    expect(teams).toHaveLength(20); // make sure there's not repeating inside the round
  }
  for (let i = 0; i < teamsCount; i++) {
    const teamRounds = matches
      .filter((match) => match.home.teamId === i || match.away.teamId === i)
      .map((match) => match.round);
    expect(teamRounds).toEqual(range(19)); // ensure index are sorted
  }
});

function getCount(matches: StoredMatch[], count: number, key: "home" | "away") {
  const indexes = [...Array(count).keys()];
  return indexes.map(
    (index) => matches.filter((match) => match[key].teamId === index).length,
  );
}
