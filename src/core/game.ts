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
  Strategy,
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

export const boostTurns = 20; // check turnsPerSecond
const boostPercentage = 1.5;
const boostMaxConcurrent = 3;
const statsNormalizationRate = 3; // force stats less discrepant so the boost has easier impact

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
      setStrategy(teamId: Team["id"], strategy: Strategy) {
        return game.setTeamStrategyInMatch(this, teamId, strategy);
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

      if (match.id === givenMatch.id) {
        // Return the match itself if the round has all the turns processed
        if (match.turns.length === maxTurns) {
          return this.getMatch(givenMatch, teamsLookup);
        }

        // prepend new turn and update scored goals
        const currentTurn = match.turns[0];
        const ballPosition = currentTurn?.ballPosition ?? 50;
        const [goals, newMomentum, evt] = runMatchTurn(
          match,
          teamsLookup[match.teamIds[0]],
          teamsLookup[match.teamIds[1]],
          this.userTeamId,
          ballPosition,
        );

        const step = 1;
        let newPosition = ballPosition;
        if (goals.some((goal) => goal)) {
          newPosition = 50; // midfield on goal
        } else if (newMomentum > 0) {
          newPosition += step;
        } else if (newMomentum < 0) {
          newPosition -= step;
        }
        const time = Math.round(match.turns.length / turnsPerSecond);
        match.turns.unshift({
          id: match.turns.length,
          ballPosition: Math.min(Math.max(newPosition, 0), 100),
          momentum: newMomentum,
          time,
          goals,
          evt: evt !== currentTurn?.evt ? evt : "",
        });
        match.goals = [match.goals[0] + goals[0], match.goals[1] + goals[1]];
        for (const playerNumber in match.boost) {
          const value = match.boost[playerNumber];
          if (value > 0) {
            match.boost[playerNumber] = value - 1;
          } else {
            delete match.boost[playerNumber];
          }
        }
        for (const i of [0, 1]) {
          if (--match.strategy[i][1] <= 0) {
            match.strategy[i] = ["", 0];
          }
        }
        updatedStoredMatch = match;
      } else {
        match.turns.push({} as StoredTurn); // hack to keep other teams matches data low
        if (match.turns.length === maxTurns) {
          const scores = match.teamIds
            .map((id) => teamsLookup[id])
            .map((team) =>
              sum(
                team.players.flatMap((player) => [
                  player.df,
                  player.md,
                  player.at,
                ]),
              ),
            );
          const goals = [6, 3];
          if (scores[1] > scores[0]) {
            goals.reverse();
          }
          match.goals = [
            Math.trunc(Math.random() * goals[0]),
            Math.trunc(Math.random() * goals[1]),
          ];
        }
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
    if (
      boost[playerNumber] ||
      Object.keys(boost).length >= boostMaxConcurrent
    ) {
      return 0;
    }
    storedMatches[index].boost = { ...boost, [playerNumber]: boostTurns };
    this.storage.matches = storedMatches;
    return boostTurns;
  }

  setTeamStrategyInMatch(
    match: Pick<Match, "id">,
    teamId: Team["id"],
    newStrategy: Strategy,
  ): [Strategy, number] {
    const storedMatches = this.storage.matches as StoredMatch[];
    const matchIndex = storedMatches.findIndex((m) => m.id === match.id);
    const teamIndex = storedMatches[matchIndex].teamIds.indexOf(teamId);
    const [strategy, turns] = storedMatches[matchIndex].strategy[teamIndex];
    if (turns) {
      return [strategy, turns];
    }
    storedMatches[matchIndex].strategy[teamIndex] = [newStrategy, boostTurns];
    this.storage.matches = storedMatches;
    return [newStrategy, boostTurns];
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

type TurnMomentum = number;

type EventMessage = string;

function runMatchTurn(
  match: StoredMatch,
  homeTeam: Team,
  awayTeam: Team,
  userTeamId: Team["id"],
  ballPosition: number,
): [TurnGoals, TurnMomentum, EventMessage] {
  const oldMomentum = match.turns[0]?.momentum ?? 0;
  const sector = getSector(ballPosition);
  const userIsHome = homeTeam.id === userTeamId;
  const homeStats = sum(
    homeTeam.players.map((player) => {
      const boost =
        userIsHome && match.boost[player.number] ? boostPercentage : 1;
      return (
        getPlayerContribution(sector, player) ** (1 / statsNormalizationRate) *
        boost
      );
    }),
  );
  const awayStats = sum(
    awayTeam.players.map((player) => {
      const boost =
        !userIsHome && match.boost[player.number] ? boostPercentage : 1;
      return (
        getPlayerContribution((sector * -1) as Sector, player) **
          (1 / statsNormalizationRate) *
        boost
      );
    }),
  );
  let increment = 0.25;
  if (homeStats < awayStats) {
    increment *= -1;
  }
  const maxMomentum = 6;
  let eventMessage = "";
  let momentum = Math.min(
    Math.max(oldMomentum + increment, -1 * maxMomentum),
    maxMomentum,
  );
  if (momentum === 0 && oldMomentum < 0) {
    console.log(homeTeam.name + " takes control");
    eventMessage = homeTeam.name + " takes control";
  }
  if (momentum < 0 && oldMomentum === 0) {
    console.log(awayTeam.name + " takes control");
    eventMessage = awayTeam.name + " takes control";
  }
  if (match.turns.length === 0) {
    eventMessage = "The match kicks off!";
  }
  if (match.turns.length === maxTurns - 1) {
    eventMessage = "The final whistle blows. Full time!";
  }

  const goals: TurnGoals = [0, 0];
  if (ballPosition === 100) {
    const [isGoal, message] = maybeScoreGoal(homeTeam, awayTeam);
    momentum *= -1;
    eventMessage = message;
    if (isGoal) {
      goals[0] = 1;
    }
  }
  if (ballPosition === 0) {
    const [isGoal, message] = maybeScoreGoal(awayTeam, homeTeam);
    momentum *= -1;
    eventMessage = message;
    if (isGoal) {
      goals[1] = 1;
    }
  }
  return [goals, momentum, eventMessage];
}

function maybeScoreGoal(attackingTeam: Team, defendingTeam: Team) {
  const goalkeeper = defendingTeam.players[0];
  const goalChance = (100 - goalkeeper.gk + 25) / 100;
  const isGoal = Math.random() > goalChance;
  let msg = "";
  if (isGoal) {
    console.log("Goal for " + attackingTeam.name);
    msg = "Goal for " + attackingTeam.name;
  } else {
    console.log("Great defense!");
    msg = "Great defense from " + goalkeeper.name;
  }
  return [isGoal, msg] as const;
}
