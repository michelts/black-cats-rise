import { expect, it } from "vitest";
import { getSector } from "../getSector";

it.each`
  position | sector
  ${0}     | ${0}
  ${32}    | ${0}
  ${33}    | ${1}
  ${65}    | ${1}
  ${66}    | ${2}
  ${100}   | ${2}
`(
  "returns the sector for the position $position as $sector",
  ({ position, sector }) => {
    expect(getSector(position)).toEqual(sector);
  },
);
