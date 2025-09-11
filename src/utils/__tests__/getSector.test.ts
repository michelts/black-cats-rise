import { expect, it } from "vitest";
import { getSector } from "../getSector";

it.each`
  position | sector
  ${0}     | ${-2}
  ${19}    | ${-2}
  ${20}    | ${-1}
  ${39}    | ${-1}
  ${40}    | ${0}
  ${59}    | ${0}
  ${60}    | ${1}
  ${79}    | ${1}
  ${80}    | ${2}
  ${100}   | ${2}
`(
  "returns the sector for the position $position as $sector",
  ({ position, sector }) => {
    expect(getSector(position)).toEqual(sector);
  },
);
