import type { KitPattern, StoredTeam } from "@/types";

export function makeTeams(): StoredTeam[] {
  return teams.map(([name, nick, region, color1, color2, pattern], index) => ({
    id: index,
    name,
    nick,
    region,
    kit: { color1, color2, pattern },
  }));
}

const teams: [string, string, string, string, string, KitPattern][] = [
  [
    "Sunderland Black Cats",
    "Black Cats",
    "Sunderland",
    "red",
    "white",
    "vertical",
  ],
  [
    "Manchester Metropolis",
    "Citizens",
    "Manchester",
    "skyblue",
    "white",
    "vertical",
  ],
  ["Tottenham Borough", "Spurs", "London", "white", "navy", "checkered"],
  ["Liverpool Mersey Reds", "Reds", "Liverpool", "red", "white", "horizontal"],
  ["Nottingham Greenwood", "Forest", "Nottingham", "red", "white", "vertical"],
  ["Highbury Arsenal", "Gunners", "London", "red", "white", "checkered"],
  ["Leeds Union", "Whites", "Leeds", "white", "blue", "horizontal"],
  [
    "Brighton Coast Albion",
    "Seagulls",
    "Brighton",
    "blue",
    "white",
    "horizontal",
  ],
  ["Fulham Riverside", "Cottagers", "London", "white", "black", "vertical"],
  ["Aston Vale", "Villans", "Birmingham", "maroon", "skyblue", "checkered"],
  ["Chelsea Borough", "Blues", "London", "royalblue", "white", "horizontal"],
  ["Crystal Park", "Eagles", "London", "red", "blue", "vertical"],
  ["Newcastle Tyne", "Magpies", "Newcastle", "black", "white", "vertical"],
  ["Everton Park", "Toffees", "Liverpool", "royalblue", "white", "horizontal"],
  [
    "Manchester Red Devils",
    "Red Devils",
    "Manchester",
    "red",
    "red",
    "vertical",
  ],
  ["Bournemouth Sands", "Cherries", "Bournemouth", "black", "red", "vertical"],
  ["Brentford Bees", "Bees", "London", "red", "white", "horizontal"],
  ["Burnley Clarets", "Clarets", "Burnley", "maroon", "skyblue", "horizontal"],
  ["West Ham Ironworks", "Hammers", "London", "maroon", "skyblue", "vertical"],
  [
    "Wolverhampton Wolves",
    "Wolves",
    "Wolverhampton",
    "gold",
    "black",
    "vertical",
  ],
];
