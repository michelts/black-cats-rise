import { expect, it } from "vitest";
import { getPlayerContribution } from "../getPlayerContribution";

it.each`
  sector  | playerPosition | contribution
  ${"df"} | ${"df"}        | ${1}
  ${"df"} | ${"md"}        | ${0.3}
  ${"df"} | ${"at"}        | ${0.1}
  ${"md"} | ${"df"}        | ${0.3}
  ${"md"} | ${"md"}        | ${1}
  ${"md"} | ${"at"}        | ${0.3}
  ${"at"} | ${"df"}        | ${0.1}
  ${"at"} | ${"md"}        | ${0.3}
  ${"at"} | ${"at"}        | ${1}
  ${"at"} | ${"gk"}        | ${0}
  ${"at"} | ${""}          | ${0}
`(
  "returns $contribution for $playerPosition player in defense area (0 to 32% of the field)",
  ({ sector, playerPosition, contribution }) => {
    expect(getPlayerContribution(sector, playerPosition)).toEqual(contribution);
  },
);
