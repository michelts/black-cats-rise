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
  assertRoundHasAllTeams(matches, teamsCount);
  assertRoundsAreSortedAscending(matches, teamsCount);
  assertUniqueMatches(matches);
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
  assertRoundHasAllTeams(matches, teamsCount);
  assertRoundsAreSortedAscending(matches, teamsCount);
  assertUniqueMatches(matches);
});

function getCount(matches: StoredMatch[], count: number, key: "home" | "away") {
  const indexes = [...Array(count).keys()];
  return indexes.map(
    (index) => matches.filter((match) => match[key].teamId === index).length,
  );
}

function assertRoundHasAllTeams(matches: StoredMatch[], teamsCount: number) {
  for (let i = 0; i < teamsCount - 1; i++) {
    const roundMatches = matches.filter((match) => match.round === i);
    expect(roundMatches).toHaveLength(teamsCount / 2);
    const teams = new Set(
      roundMatches.flatMap((match) => [match.home.teamId, match.away.teamId]),
    );
    expect(teams).toHaveLength(teamsCount); // make sure there's not repeating inside the round
  }
}

function assertRoundsAreSortedAscending(
  matches: StoredMatch[],
  teamsCount: number,
) {
  for (let i = 0; i < teamsCount; i++) {
    const teamRounds = matches
      .filter((match) => match.home.teamId === i || match.away.teamId === i)
      .map((match) => match.round);
    expect(teamRounds).toEqual(range(teamsCount - 1)); // ensure index are sorted
  }
}

function assertUniqueMatches(matches: StoredMatch[]) {
  const result: string[] = [];
  for (const match of matches) {
    const ids = [match.home.teamId, match.away.teamId];
    ids.sort();
    const key = `${ids[0]}-${ids[1]}`;
    if (result.includes(key)) {
      console.log("Duplicate key", key);
      throw new Error(`Duplicate: ${key}`);
    }
    result.push(key);
  }
}
