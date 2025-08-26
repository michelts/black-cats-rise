import { Factory } from "fishery";
import type { Team } from "@/types";

export const TeamFactory = Factory.define<Team>(({ sequence }) => ({
  name: `Team ${sequence}`,
  nick: `Nick ${sequence}`,
  region: `Region ${sequence}`,
  kit: {
    color1: "red",
    color2: "black",
    pattern: "vertical",
  },
}));
