import { makePlayerNames } from "@/utils/makePlayerNames";
import { generateEmptyMatches } from "./matches";
import { makeTeamNames } from "./teams";
import type { Match, Team } from "@/types";

export class Game {
  storage: Storage;
  currentDate: Date;

  constructor(storage: Storage) {
    this.currentDate = new Date();
    this.storage = storage;
    this.storage.teams = makeTeamNames();
    this.storage.matches = Array.from(generateEmptyMatches(this.teams.length));
    this.storage.playerNames = makePlayerNames();
  }

  get playerNames() {
    return this.storage.playerNames;
  }

  get teams() {
    return this.storage.teams as Team[];
  }

  get matches() {
    const teams = this.teams;
    return (this.storage.matches as Match[]).map((match) => ({
      ...match,
      home: {
        ...match.home,
        team: teams[match.home.teamId],
      },
      away: {
        ...match.away,
        team: teams[match.away.teamId],
      },
    }));
  }
}
