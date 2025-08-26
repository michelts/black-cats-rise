import type { EvenNumber, Match, StoredMatch, StoredTeam } from "@/types";
import { makePlayerNames } from "@/utils/makePlayerNames";
import { generateEmptyMatches } from "./matches";
import { makeTeamNames } from "./teams";

export class Game {
  storage: Record<string, unknown>;

  constructor(storage: Record<string, unknown>) {
    this.storage = storage;
    if (!this.storage.teams) {
      this.reset();
    }
  }

  reset() {
    this.storage.currentDate = Date.now();
    this.storage.teams = makeTeamNames();
    this.storage.matches = Array.from(
      generateEmptyMatches(this.teams.length as EvenNumber),
    );
    this.storage.playerNames = makePlayerNames();
  }

  get currentDate() {
    return new Date(this.storage.currentDate as number);
  }

  get playerNames() {
    return this.storage.playerNames as string[];
  }

  get teams() {
    const teams = (this.storage.teams as StoredTeam[]).map((team) => ({
      ...team,
      mp: 0,
      w: 0,
      d: 0,
      l: 0,
      f: 0,
      a: 0,
      gd: 0,
      pts: 0,
    }));
    for (const match of this.storage.matches as Match[]) {
      const { goals, home, away } = match;
      if (!goals) {
        continue;
      }
      teams[home.idx].mp += 1;
      teams[away.idx].mp += 1;
      if (goals.home > goals.away) {
        teams[home.idx].w += 1;
        teams[away.idx].l += 1;
        teams[home.idx].pts += 3;
      } else if (goals.home < goals.away) {
        teams[home.idx].l += 1;
        teams[away.idx].w += 1;
        teams[away.idx].pts += 3;
      } else {
        teams[home.idx].d += 1;
        teams[away.idx].d += 1;
        teams[home.idx].pts += 1;
        teams[away.idx].pts += 1;
      }

      teams[home.idx].f += goals.home;
      teams[home.idx].a += goals.away;
      teams[home.idx].gd += goals.home - goals.away;
      teams[away.idx].f += goals.away;
      teams[away.idx].a += goals.home;
      teams[away.idx].gd += goals.away - goals.home;
    }
    teams.sort((a, b) => {
      if (a.pts !== b.pts) {
        return b.pts - a.pts;
      }
      if (a.gd !== b.gd) {
        return b.gd - a.gd;
      }
      if (a.f !== b.f) {
        return b.f - a.f;
      }
      return a.a - b.a;
    });
    return teams;
  }

  get matches() {
    return (this.storage.matches as StoredMatch[]).map(
      this.transformMatch.bind(this),
    );
  }

  transformMatch(match: StoredMatch): Match {
    const teams = this.teams;
    const matchDate = this.currentDate;
    matchDate.setDate(matchDate.getDate() + match.round * 7);
    const currentTeamId = 0;
    return {
      ...match,
      home: {
        ...match.home,
        team: teams[match.home.idx],
      },
      away: {
        ...match.away,
        team: teams[match.away.idx],
      },
      date: matchDate,
      isCurrent:
        match.round === this.currentRound &&
        (match.home.idx === currentTeamId || match.away.idx === currentTeamId),
      play: () => {
        const storedMatches = this.storage.matches as StoredMatch[];
        const roundMatches = storedMatches.filter(
          (storedMatch) => storedMatch.round === match.round,
        );
        for (const roundMatch of roundMatches) {
          const storedMatchIndex = storedMatches.findIndex(
            (item) => item.id === roundMatch.id,
          );
          storedMatches[storedMatchIndex].goals = {
            home: Math.round(Math.random() * 10),
            away: Math.round(Math.random() * 10),
          };
        }
        this.storage.matches = storedMatches;
      },
    };
  }

  get currentRound() {
    const match = (this.storage.matches as StoredMatch[]).find(
      (match) => !match.goals,
    );
    return match?.round;
  }
}
