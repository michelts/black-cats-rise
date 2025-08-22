import { makePlayerNames } from "@/utils/makePlayerNames";
import { combineMatches } from "./matches";
import { makeTeamNames } from "./teams";

export class Game {
  storage: Storage;
  currentDate: Date;

  constructor(storage: Storage) {
    this.currentDate = new Date();
    this.storage = storage;
    this.storage.teams = makeTeamNames();
    this.storage.matches = combineMatches(this.teams);
    this.storage.playerNames = makePlayerNames();
  }

  get playerNames() {
    return this.storage.playerNames;
  }

  get teams() {
    return this.storage.teams;
  }
}
