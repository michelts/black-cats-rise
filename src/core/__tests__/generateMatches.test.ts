import { expect, it } from "vitest";
import type { StoredMatch } from "@/types";
import { range } from "@/utils/range";
import { generateEmptyMatches } from "../matches";

it("generates matches", () => {
  const teamsCount = 6;
  const matches = generateEmptyMatches(teamsCount);
  expect(matches).toHaveLength(15);
  assertRoundHasAllTeams(matches, teamsCount);
  assertRoundsAreSortedAscending(matches, teamsCount);
  assertUniqueMatches(matches);
  expect(getCount(matches, teamsCount, "home")).toEqual([3, 3, 3, 2, 2, 2]);
  expect(getCount(matches, teamsCount, "away")).toEqual([2, 2, 2, 3, 3, 3]);
});

it("generates matches with 20 teams", () => {
  const teamsCount = 20;
  const matches = generateEmptyMatches(teamsCount);
  expect(matches).toHaveLength(190);
  assertRoundHasAllTeams(matches, teamsCount);
  assertRoundsAreSortedAscending(matches, teamsCount);
  assertUniqueMatches(matches);
  expect(getCount(matches, teamsCount, "home")).toEqual([
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
  ]);
  expect(getCount(matches, teamsCount, "away")).toEqual([
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  ]);
});

function getCount(matches: StoredMatch[], count: number, key: "home" | "away") {
  const indexes = [...Array(count).keys()];
  const indexOnTeamIds = key === "home" ? 0 : 1;
  return indexes.map(
    (index) =>
      matches.filter((match) => match.teamIds[indexOnTeamIds] === index).length,
  );
}

function assertRoundHasAllTeams(matches: StoredMatch[], teamsCount: number) {
  for (let i = 0; i < teamsCount - 1; i++) {
    const roundMatches = matches.filter((match) => match.round === i);
    expect(roundMatches).toHaveLength(teamsCount / 2);
    const teams = new Set(roundMatches.flatMap((match) => match.teamIds));
    expect(teams).toHaveLength(teamsCount); // make sure there's not repeating inside the round
  }
}

function assertRoundsAreSortedAscending(
  matches: StoredMatch[],
  teamsCount: number,
) {
  for (let i = 0; i < teamsCount; i++) {
    const teamRounds = matches
      .filter((match) => match.teamIds.includes(i))
      .map((match) => match.round);
    expect(teamRounds).toEqual(range(teamsCount - 1)); // ensure index are sorted
  }
}

function assertUniqueMatches(matches: StoredMatch[]) {
  const result: string[] = [];
  for (const match of matches) {
    const ids = [...match.teamIds];
    ids.sort();
    const key = `${ids[0]}-${ids[1]}`;
    if (result.includes(key)) {
      throw new Error(`Duplicate: ${key}`);
    }
    result.push(key);
  }
}
