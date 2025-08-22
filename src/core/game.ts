import type { GameStorage } from "@/types";
import { makePlayerNames } from "@/utils/makePlayerNames";
import { makeTeamNames } from "./teams";

export class Game {
  storage: GameStorage;

  constructor(storage: GameStorage) {
    this.storage = storage;
    this.storage.playerNames = makePlayerNames();
    this.storage.teamNames = makeTeamNames(20);
  }

  getPlayerNames() {
    return this.storage.playerNames;
  }
}
