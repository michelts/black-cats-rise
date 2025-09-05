import {
  PatternCheckered,
  PatternHorizontal,
  PatternVertical,
  type KitPattern,
  type StoredTeam,
} from "@/types";
import { playerNameFactory } from "@/utils/playerNameFactory";
import { getFormation } from "./formations";
import { makePlayers } from "./players";

export function makeTeams(): StoredTeam[] {
  const getPlayerName = playerNameFactory();
  const formation = getFormation();
  return teams.map(([name, nick, region, color1, color2, pattern], index) => ({
    id: index,
    name,
    nick,
    region,
    kit: { color1, color2, pattern },
    formation,
    players: Array.from(makePlayers(formation, getPlayerName)),
  }));
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
    "red",
    "white",
    PatternHorizontal,
  ],
  [
    "Nottingham Greenwood",
    "Forest",
    "Nottingham",
    "red",
    "white",
    PatternVertical,
  ],
  ["Highbury Arsenal", "Gunners", "London", "red", "white", PatternCheckered],
  ["Leeds Union", "Whites", "Leeds", "white", "blue", PatternHorizontal],
  [
    "Brighton Coast Albion",
    "Seagulls",
    "Brighton",
    "blue",
    "white",
    PatternHorizontal,
  ],
  [
    "Fulham Riverside",
    "Cottagers",
    "London",
    "white",
    "black",
    PatternVertical,
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
    "royalblue",
    "white",
    PatternHorizontal,
  ],
  ["Crystal Park", "Eagles", "London", "red", "blue", PatternVertical],
  ["Newcastle Tyne", "Magpies", "Newcastle", "black", "white", PatternVertical],
  [
    "Everton Park",
    "Toffees",
    "Liverpool",
    "royalblue",
    "white",
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
  ["Brentford Bees", "Bees", "London", "red", "white", PatternHorizontal],
  [
    "Burnley Clarets",
    "Clarets",
    "Burnley",
    "maroon",
    "skyblue",
    PatternHorizontal,
  ],
  [
    "West Ham Ironworks",
    "Hammers",
    "London",
    "maroon",
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
