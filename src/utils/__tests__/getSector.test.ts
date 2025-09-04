import { expect, it } from "vitest";
import { getSector } from "../getSector";

it.each`
  position | sector
  ${0}     | ${-1}
  ${32}    | ${-1}
  ${33}    | ${0}
  ${65}    | ${0}
  ${66}    | ${1}
  ${100}   | ${1}
`(
  "returns the sector for the position $position as $sector",
  ({ position, sector }) => {
    expect(getSector(position)).toEqual(sector);
  },
);
