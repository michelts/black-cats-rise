import { expect, it } from "vitest";
import type { Match } from "@/types";
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
  expect(matches).toEqual([
    // round 0
    { away: { teamId: 5 }, home: { teamId: 0 }, round: 0 },
    { away: { teamId: 4 }, home: { teamId: 1 }, round: 0 },
    { away: { teamId: 3 }, home: { teamId: 2 }, round: 0 },
    // round 1
    { away: { teamId: 4 }, home: { teamId: 5 }, round: 1 },
    { away: { teamId: 3 }, home: { teamId: 0 }, round: 1 },
    { away: { teamId: 2 }, home: { teamId: 1 }, round: 1 },
    // round 2
    { away: { teamId: 3 }, home: { teamId: 4 }, round: 2 },
    { away: { teamId: 2 }, home: { teamId: 5 }, round: 2 },
    { away: { teamId: 1 }, home: { teamId: 0 }, round: 2 },
    // round 3
    { away: { teamId: 2 }, home: { teamId: 3 }, round: 3 },
    { away: { teamId: 1 }, home: { teamId: 4 }, round: 3 },
    { away: { teamId: 0 }, home: { teamId: 5 }, round: 3 },
    // round 4
    { away: { teamId: 1 }, home: { teamId: 2 }, round: 4 },
    { away: { teamId: 0 }, home: { teamId: 3 }, round: 4 },
    { away: { teamId: 5 }, home: { teamId: 4 }, round: 4 },
  ]);
});

function getCount(matches: Match[], count: number, key: "home" | "away") {
  const indexes = [...Array(count).keys()];
  return indexes.map(
    (index) => matches.filter((match) => match[key].teamId === index).length,
  );
}
