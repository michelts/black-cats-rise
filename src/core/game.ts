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
    this.storage.initialDate = Date.now();
    this.storage.currentDate = Date.now();
    this.storage.teams = makeTeamNames();
    this.storage.matches = Array.from(
      generateEmptyMatches(this.teams.length as EvenNumber),
    );
    this.storage.playerNames = makePlayerNames();
  }

  get initialDate() {
    return new Date(this.storage.initialDate as number);
  }

  get currentDate() {
    return new Date(this.storage.currentDate as number);
  }

  getDateFromInitial(weeks: number) {
    const date = this.initialDate;
    date.setDate(date.getDate() + weeks * 7);
    return date;
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
    for (const match of this.storage.matches as StoredMatch[]) {
      const {
        teamIds: [home, away],
        goals,
      } = match;
      if (!goals) {
        continue;
      }
      teams[home].mp += 1;
      teams[away].mp += 1;
      if (goals[0] > goals[1]) {
        teams[home].w += 1;
        teams[away].l += 1;
        teams[home].pts += 3;
      } else if (goals[0] < goals[1]) {
        teams[home].l += 1;
        teams[away].w += 1;
        teams[away].pts += 3;
      } else {
        teams[home].d += 1;
        teams[away].d += 1;
        teams[home].pts += 1;
        teams[away].pts += 1;
      }

      teams[home].f += goals[0];
      teams[home].a += goals[1];
      teams[home].gd += goals[0] - goals[1];
      teams[away].f += goals[1];
      teams[away].a += goals[0];
      teams[away].gd += goals[1] - goals[0];
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
    const teams = Object.fromEntries(this.teams.map((team) => [team.id, team]));
    const currentTeamId = 0;
    return (this.storage.matches as StoredMatch[]).map((match) => ({
      ...match,
      teams: [teams[match.teamIds[0]], teams[match.teamIds[1]]],
      date: this.getDateFromInitial(match.round),
      isCurrent:
        match.round === this.currentRound &&
        match.teamIds.includes(currentTeamId),
      play: () => this.playMatch(match),
    }));
  }

  playMatch(match: StoredMatch) {
    const storedMatches = this.storage.matches as StoredMatch[];
    const roundMatches = storedMatches.filter(
      (storedMatch) => storedMatch.round === match.round,
    );
    for (const roundMatch of roundMatches) {
      const storedMatchIndex = storedMatches.findIndex(
        (item) => item.id === roundMatch.id,
      );
      storedMatches[storedMatchIndex].goals = [
        Math.round(Math.random() * 10),
        Math.round(Math.random() * 10),
      ];
    }
    this.storage.currentDate = this.getDateFromInitial(match.round + 1);
    this.storage.matches = storedMatches;
  }

  get currentRound() {
    const match = (this.storage.matches as StoredMatch[]).find(
      (match) => !match.goals,
    );
    return match?.round;
  }
}
