import type { EvenNumber, Match, StoredMatch, Team } from "@/types";
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
    return (this.storage.matches as StoredMatch[]).map(
      this.transformMatch.bind(this),
    );
  }

  transformMatch(match: StoredMatch): Match {
    const teams = this.teams;
    const matchDate = new Date(this.currentDate);
    matchDate.setDate(matchDate.getDate() + match.round * 7);
    const currentTeamId = 0;
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
      isCurrent:
        (match.round === this.currentRound &&
          match.home.teamId === currentTeamId) ||
        match.away.teamId === currentTeamId,
      play: () => {
        const storedMatches = this.storage.matches as StoredMatch[];
        const roundMatches = storedMatches.filter(
          (storedMatch) => storedMatch.round === match.round,
        );
        for (const roundMatch of roundMatches) {
          const storedMatchIndex = storedMatches.findIndex(
            (item) => item.id === roundMatch.id,
          );
          storedMatches[storedMatchIndex].score = {
            home: Math.round(Math.random() * 10),
            away: Math.round(Math.random() * 10),
          };
        }
        this.storage.matches = storedMatches;
        console.log("XXX play");
      },
    };
  }

  get currentRound() {
    const match = (this.storage.matches as StoredMatch[]).find(
      (match) => !match.score,
    );
    return match?.round;
  }
}
