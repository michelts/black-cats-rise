import type { Game as GameType } from "@/types";
import { makePlayerNames } from "@/utils/makePlayerNames";
import { makeTeamNames } from "./teams";

export class Game {
  storage: GameType;
  currentDate: Date;

  constructor(storage: GameType) {
    this.currentDate = new Date();
    this.storage = storage;
    this.storage.teams = makeTeamNames();
    this.storage.playerNames = makePlayerNames();
  }

  get playerNames() {
    return this.storage.playerNames;
  }

  get teams() {
    return this.storage.teams;
  }
}
