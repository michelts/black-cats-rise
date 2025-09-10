import { expect, it } from "vitest";
import { PlayerFactory } from "@/factories";
import { getPlayerContribution } from "../getPlayerContribution";

it.each`
  sector | playerPos | df   | md   | at   | contribution
  ${-1}  | ${"df"}   | ${1} | ${0} | ${0} | ${1}
  ${-1}  | ${"md"}   | ${1} | ${0} | ${0} | ${0.3}
  ${-1}  | ${"at"}   | ${1} | ${0} | ${0} | ${0.1}
  ${0}   | ${"df"}   | ${0} | ${1} | ${0} | ${0.3}
  ${0}   | ${"md"}   | ${0} | ${1} | ${0} | ${1}
  ${0}   | ${"at"}   | ${0} | ${1} | ${0} | ${0.3}
  ${1}   | ${"df"}   | ${0} | ${0} | ${1} | ${0.1}
  ${1}   | ${"md"}   | ${0} | ${0} | ${1} | ${0.3}
  ${1}   | ${"at"}   | ${0} | ${0} | ${1} | ${1}
`(
  "returns $contribution for $playerPos player in sector $sector",
  ({ sector, playerPos, df, md, at, contribution }) => {
    const player = PlayerFactory.build({ pos: playerPos, df, md, at });
    expect(getPlayerContribution(sector, player, 0)).toEqual(contribution);
  },
);

it.each`
  sector | playerPos    | contribution
  ${-1}  | ${"gk"}      | ${0}
  ${0}   | ${"gk"}      | ${0}
  ${1}   | ${"gk"}      | ${0}
  ${-1}  | ${undefined} | ${0}
  ${0}   | ${undefined} | ${0}
  ${1}   | ${undefined} | ${0}
`(
  "returns zero for goal keepers and reserves for sector $sector",
  ({ sector, contribution }) => {
    const player = PlayerFactory.build({ pos: "gk", df: 1, md: 1, at: 1 });
    expect(getPlayerContribution(sector, player, 0)).toEqual(contribution);
  },
);
