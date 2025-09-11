import type {
  CompleteMatch,
  EvenNumber,
  Formation,
  Game as GameType,
  LiveMatch,
  Match,
  PendingMatch,
  Player,
  Sector,
  StoredMatch,
  StoredTeam,
  StoredTurn,
  Table,
  Team,
} from "@/types";
import { getPlayerContribution } from "@/utils/getPlayerContribution";
import { getSector } from "@/utils/getSector";
import { sum } from "@/utils/sum";
import { adjustIntoPosition } from "./formations";
import { generateEmptyMatches } from "./matches";
import { getTable } from "./table";
import { makeTeams } from "./teams";

export const time = 90; // production value: 90
const turnsPerSecond = 4;
export const maxTurns = time * turnsPerSecond;
export const turnTimeout = 250; // increase or decrease for controlling game speed

export const boostTurns = 36; // check turnsPerSecond

export class Game implements GameType {
  storage: Record<string, unknown>;
  userTeamId: number;

  constructor(userTeamId: number, storage: Record<string, unknown>) {
    this.storage = storage;
    this.userTeamId = userTeamId;
    if (!this.storage.teams) {
      this.reset();
    }
  }

  reset() {
    this.storage.initialDate = Date.now();
    this.storage.currentDate = Date.now();
    this.storage.teams = makeTeams();
    this.storage.matches = Array.from(
      generateEmptyMatches(this.teams.length as EvenNumber),
    );
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

  get teams(): Team[] {
    const teams = (this.storage.teams as StoredTeam[]).map((team) => ({
      ...team,
      players: adjustIntoPosition(team.players, team.formation),
      setFormation: (formation: Formation) =>
        this.setTeamFormation(team.id, formation),
      swapPlayers: (originIndex: number, destinationIndex: number) =>
        this.swapPlayers(team.id, originIndex, destinationIndex),
    }));
    return teams;
  }

  get userTeam(): Team {
    return this.teams.filter((team) => team.id === this.userTeamId)[0];
  }

  get matches(): Match[] {
    const teamsLookup = Object.fromEntries(
      this.teams.map((team) => [team.id, team]),
    );
    return (this.storage.matches as StoredMatch[]).map((match) =>
      this.getMatch(match, teamsLookup),
    );
  }

  getMatch(match: StoredMatch, teamsLookup: Record<Team["id"], Team>): Match {
    const teams = [
      teamsLookup[match.teamIds[0]],
      teamsLookup[match.teamIds[1]],
    ] satisfies [Team, Team];
    const date = this.getDateFromInitial(match.round);
    const isCurrent =
      match.round === this.currentRound &&
      match.teamIds.includes(this.userTeamId);
    const game = this;
    const commonProps = {
      ...match,
      teams,
      date,
      isCurrent,
      advance() {
        return game.advanceMatch(this, teamsLookup);
      },
      boostPlayer(playerNumber: Player["number"]) {
        return game.boostPlayerInMatch(this, playerNumber);
      },
    };
    if (match.turns.length === maxTurns) {
      return {
        ...commonProps,
        isPending: false,
        isLive: false,
        isDone: true,
      } satisfies CompleteMatch;
    }
    if (match.turns.length > 0) {
      return {
        ...commonProps,
        isPending: false,
        isLive: true,
        isDone: false,
        turns: match.turns as [StoredTurn, ...StoredTurn[]],
      } satisfies LiveMatch;
    }
    return {
      ...commonProps,
      isPending: true,
      isLive: false,
      isDone: false,
    } satisfies PendingMatch;
  }

  advanceMatch(
    givenMatch: StoredMatch,
    teamsLookup: Record<Team["id"], Team>,
  ): Match {
    const storedMatches = this.storage.matches as StoredMatch[];
    let updatedStoredMatch: StoredMatch | null = null;
    for (const match of storedMatches) {
      // Filter only matches from the current round
      if (match.round !== givenMatch.round) {
        continue;
      }

      // Return the match itself if the round has all the turns processed
      if (match.turns.length === maxTurns) {
        return this.getMatch(givenMatch, teamsLookup);
      }

      // prepend new turn and update scored goals
      const [goals, ballPosition] = runMatchTurn(
        match,
        teamsLookup[match.teamIds[0]],
        teamsLookup[match.teamIds[1]],
        match.id === givenMatch.id,
      );
      match.turns.unshift({
        ballPosition,
        time: Math.round(match.turns.length / 4),
      });
      match.goals = [match.goals[0] + goals[0], match.goals[1] + goals[1]];
      for (const playerNumber in match.boost) {
        const value = match.boost[playerNumber];
        if (match.id === givenMatch.id) {
          // console.log("current boost", value);
        }
        if (value > 0) {
          match.boost[playerNumber] = value - 1;
        } else {
          delete match.boost[playerNumber];
        }
      }

      if (match.id === givenMatch.id) {
        updatedStoredMatch = match;
      }
    }
    this.storage.matches = storedMatches;
    const updatedMatch = this.getMatch(updatedStoredMatch!, teamsLookup);
    if (updatedMatch.isDone) {
      this.storage.currentDate = this.getDateFromInitial(givenMatch.round + 1);
    }
    return updatedMatch;
  }

  boostPlayerInMatch(match: Pick<Match, "id">, playerNumber: Player["number"]) {
    const storedMatches = this.storage.matches as StoredMatch[];
    const index = storedMatches.findIndex((m) => m.id === match.id);
    const boost = storedMatches[index].boost;
    if (boost[playerNumber] || Object.keys(boost).length > 2) {
      console.log("REJECT", boost[playerNumber], Object.keys(boost).length);
      return 0;
    }
    storedMatches[index].boost = { ...boost, [playerNumber]: boostTurns };
    this.storage.matches = storedMatches;
    return boostTurns;
  }

  setTeamFormation(teamId: Team["id"], formation: Formation) {
    const teams = this.storage.teams as StoredTeam[];
    teams[teamId].formation = formation;
    this.storage.teams = teams;
  }

  swapPlayers(
    teamId: Team["id"],
    originIndex: number,
    destinationIndex: number,
  ) {
    const teams = this.storage.teams as StoredTeam[];
    const players = teams[teamId].players;
    [players[originIndex], players[destinationIndex]] = [
      players[destinationIndex],
      players[originIndex],
    ];
    teams[teamId].players = players;
    this.storage.teams = teams;
  }

  get currentRound() {
    const match = (this.storage.matches as StoredMatch[]).find(
      (match) => match.turns.length !== maxTurns,
    );
    return match?.round;
  }

  get table(): Table[] {
    return getTable(this.teams, this.matches);
  }
}

type TurnGoals = [0 | 1, 0 | 1];

function runMatchTurn(
  match: StoredMatch,
  homeTeam: Team,
  awayTeam: Team,
  debug: boolean,
): [TurnGoals, number] {
  const currentBallPosition = match.turns[0]?.ballPosition ?? 50;
  const sector = getSector(currentBallPosition);
  const homeScore = sum(
    homeTeam.players.map((player) =>
      getPlayerContribution(sector, player, match.boost[player.number]),
    ),
  );
  const awayScore = sum(
    awayTeam.players.map((player) =>
      getPlayerContribution(
        (sector * -1) as Sector,
        player,
        match.boost[player.number],
      ),
    ),
  );
  const threshold = Math.abs(homeScore - awayScore);
  let increment = Math.max(threshold ** 0.4 - 2, 0); // 10 -> 1, 20 -> 2, 30 -> 3, 40 -> 4
  if (awayScore > homeScore) {
    increment *= -1;
  }
  const newPosition = Math.min(
    Math.max(currentBallPosition + increment, 0),
    100,
  );
  if (debug) {
    //console.log({ threshold, increment });
  }

  const goals: TurnGoals = [0, 0];
  return [goals, newPosition];
}
