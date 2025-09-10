import {
  type KitPattern,
  PatternCheckered,
  PatternHorizontal,
  PatternMeridian,
  PatternParallel,
  PatternVertical,
  type StoredTeam,
} from "@/types";
import { playerNameFactory } from "@/utils/playerNameFactory";
import { getFormation } from "./formations";
import { makePlayers } from "./players";

export function makeTeams(): StoredTeam[] {
  const getPlayerName = playerNameFactory();
  return teams.map(([name, nick, region, color1, color2, pattern], index) => {
    const formation = getFormation();
    return {
      id: index,
      name,
      nick,
      region,
      kit: { color1, color2, pattern },
      formation,
      players: Array.from(makePlayers(formation, getPlayerName)),
    };
  });
}

const teams: [string, string, string, string, string, KitPattern][] = [
  [
    "Sunderland Black Cats",
    "Black Cats",
    "Sunderland",
    "red",
    "white",
    PatternVertical,
  ],
  [
    "Manchester Metropolis",
    "Citizens",
    "Manchester",
    "skyblue",
    "white",
    PatternVertical,
  ],
  ["Tottenham Borough", "Spurs", "London", "white", "navy", PatternCheckered],
  [
    "Liverpool Mersey Reds",
    "Reds",
    "Liverpool",
    "white",
    "red",
    PatternHorizontal,
  ],
  [
    "Nottingham Greenwood",
    "Forest",
    "Nottingham",
    "red",
    "white",
    PatternParallel,
  ],
  ["Highbury Arsenal", "Gunners", "London", "red", "white", PatternCheckered],
  ["Leeds Union", "Whites", "Leeds", "white", "blue", PatternMeridian],
  [
    "Brighton Coast Albion",
    "Seagulls",
    "Brighton",
    "white",
    "blue",
    PatternHorizontal,
  ],
  [
    "Fulham Riverside",
    "Cottagers",
    "London",
    "lightgray",
    "white",
    PatternMeridian,
  ],
  [
    "Aston Vale",
    "Villans",
    "Birmingham",
    "maroon",
    "skyblue",
    PatternCheckered,
  ],
  [
    "Chelsea Borough",
    "Blues",
    "London",
    "steelblue",
    "royalblue",
    PatternParallel,
  ],
  ["Crystal Park", "Eagles", "London", "red", "blue", PatternParallel],
  ["Newcastle Tyne", "Magpies", "Newcastle", "white", "black", PatternVertical],
  [
    "Everton Park",
    "Toffees",
    "Liverpool",
    "royalblue",
    "royalblue",
    PatternHorizontal,
  ],
  [
    "Manchester Red Devils",
    "Red Devils",
    "Manchester",
    "red",
    "red",
    PatternVertical,
  ],
  [
    "Bournemouth Sands",
    "Cherries",
    "Bournemouth",
    "black",
    "red",
    PatternVertical,
  ],
  ["Brentford Bees", "Bees", "London", "red", "white", PatternMeridian],
  [
    "Burnley Clarets",
    "Clarets",
    "Burnley",
    "brown",
    "skyblue",
    PatternParallel,
  ],
  [
    "West Ham Ironworks",
    "Hammers",
    "London",
    "brown",
    "skyblue",
    PatternVertical,
  ],
  [
    "Wolverhampton Wolves",
    "Wolves",
    "Wolverhampton",
    "gold",
    "black",
    PatternVertical,
  ],
];
