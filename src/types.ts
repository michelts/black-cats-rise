export interface Game {
  playerNames: string[];
  teams: Team[];
  matches: Array<
    Omit<Match, "home" | "away"> & {
      home: MatchStatsWithTeam;
      away: MatchStatsWithTeam;
      date: Date;
      isCurrent: boolean;
    }
  >;
  currentDate: Date;
}

export type Screen = "splash" | "game" | "matches" | "team" | "table";

export interface Team {
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

export interface Match {
  round: number;
  home: MatchStats;
  away: MatchStats;
  score?: {
    home: number;
    away: number;
  };
}

interface MatchStats {
  teamId: number;
  goals?: number;
}

interface MatchStatsWithTeam {
  teamId: number;
  team: Team;
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
