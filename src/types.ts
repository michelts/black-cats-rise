export interface Game {
  playerNames: string[];
  teams: Team[];
  matches: Array<Match>;
  currentDate: Date;
}

export type Screen = "splash" | "game" | "matches" | "team" | "table";

export interface Team extends StoredTeam {
  mp: number; // matches played
  w: number; // won
  d: number; // drawn
  l: number; // lose
  f: number; // goals for
  a: number; // goals against
  gd: number; // goal difference
  pts: number; // points
}

export interface StoredTeam {
  id: number;
  name: string;
  nick: string;
  region: string;
  kit: Kit;
}

export interface Kit {
  color1: string;
  color2: string;
  pattern: KitPattern;
}

export type KitPattern = "vertical" | "horizontal" | "checkered";

export type MatchKey = `${number}-${number}`;

export interface Match extends StoredMatch {
  teams: [Team, Team];
  date: Date;
  isCurrent: boolean;
  play: () => void;
}

export interface StoredMatch {
  id: string;
  round: number;
  teamIds: [Team["id"], Team["id"]];
  goals?: [number, number];
}

export type EvenNumber =
  | 0
  | 2
  | 4
  | 6
  | 8
  | 10
  | 12
  | 14
  | 16
  | 18
  | 20
  | 22
  | 24
  | 26
  | 28
  | 30;
