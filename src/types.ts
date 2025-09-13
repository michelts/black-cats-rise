export interface Game {
  teams: Team[];
  table: Table[];
  userTeam: Team;
  matches: Array<Match>;
  currentDate: Date;
  reset: () => void;
}

export type Screen =
  | "splash"
  | "game"
  | "continue"
  | "matches"
  | "team"
  | "table"
  | "live";

export interface Team extends StoredTeam {
  players: Player[];
  setFormation: (formation: Formation) => void;
  swapPlayers: (originIndex: number, destinationIndex: number) => void;
}

export interface Table {
  team: Team;
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
  formation: Formation;
  players: StoredPlayer[];
}

export interface Kit {
  color1: string;
  color2: string;
  pattern: KitPattern;
}

export type Formation = `${number}-${number}-${number}`;

export type Sector = -1 | 0 | 1;

export type Position = "gk" | "df" | "md" | "at";

export interface Player extends StoredPlayer {
  pos?: Position;
}

export interface StoredPlayer {
  name: string;
  number: number;
  gk: number;
  df: number;
  md: number;
  at: number;
}

export type KitPattern = "v" | "h" | "c" | "m" | "p";
export const PatternVertical = "v";
export const PatternHorizontal = "h";
export const PatternCheckered = "c";
export const PatternMeridian = "m";
export const PatternParallel = "p";

export type MatchKey = `${number}-${number}`;

export type Match = PendingMatch | LiveMatch | CompleteMatch;

export type CompleteMatch = BaseMatch & {
  isPending: false;
  isLive: false;
  isDone: true;
};

export type LiveMatch = Omit<BaseMatch, "turns"> & {
  isPending: false;
  isLive: true;
  isDone: false;
  turns: [StoredTurn, ...StoredTurn[]];
};

export type PendingMatch = BaseMatch & {
  isPending: true;
  isLive: false;
  isDone: false;
};

type BaseMatch = StoredMatch & {
  teams: [Team, Team];
  date: Date;
  isCurrent: boolean;
  advance: () => Match;
  boostPlayer: (playerNumber: Player["number"]) => number; // returns the boost itself
  setStrategy: (teamId: Team["id"], strategy: Strategy) => [Strategy, number]; // return the strategy turns itself
};

export interface StoredMatch {
  id: string;
  round: number;
  teamIds: [StoredTeam["id"], StoredTeam["id"]];
  turns: StoredTurn[];
  goals: [number, number];
  boost: Record<StoredPlayer["number"], number>;
  strategy: [[Strategy, number], [Strategy, number]];
}

// All out attack, park the bus, pressure up, couter attack, empty
export type Strategy = "att" | "prk" | "prss" | "cntr" | "";

export interface StoredTurn {
  id: number;
  ballPosition: number;
  momentum: number;
  time: number; // time ellapsed
  goals: [number, number];
  evt: string;
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
