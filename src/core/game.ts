import type { EvenNumber, Match, MatchFromStorage, Team } from "@/types";
import { makePlayerNames } from "@/utils/makePlayerNames";
import { generateEmptyMatches } from "./matches";
import { makeTeamNames } from "./teams";

export class Game {
  storage: Storage;
  currentDate: Date;

  constructor(storage: Storage) {
    this.currentDate = new Date();
    this.storage = storage;
    this.storage.teams = makeTeamNames();
    this.storage.matches = Array.from(
      generateEmptyMatches(this.teams.length as EvenNumber),
    );
    this.storage.playerNames = makePlayerNames();
  }

  get playerNames() {
    return this.storage.playerNames;
  }

  get teams() {
    return this.storage.teams as Team[];
  }

  get matches() {
    const currentTeamId = 0;
    return (this.storage.matches as MatchFromStorage[])
      .map(this.transformMatch.bind(this))
      .filter(
        (match) =>
          match.home.teamId === currentTeamId ||
          match.away.teamId === currentTeamId,
      );
  }

  transformMatch(match: MatchFromStorage): Match {
    const teams = this.teams;
    const matchDate = new Date(this.currentDate);
    matchDate.setDate(matchDate.getDate() + match.round * 7);
    return {
      ...match,
      home: {
        ...match.home,
        team: teams[match.home.teamId],
      },
      away: {
        ...match.away,
        team: teams[match.away.teamId],
      },
      date: matchDate,
      isCurrent: match.round === this.currentRound,
      play: () => {
        console.log("XXX play", this.storage);
      },
    };
  }

  get currentRound() {
    const match = (this.storage.matches as MatchFromStorage[]).find(
      (match) => !match.score,
    );
    return match?.round;
  }
}
