export type GameStorage = {
  playerNames?: string[];
  [rest: string]: unknown;
};

export type Screen = "splash" | "game" | "matches" | "team" | "table";
