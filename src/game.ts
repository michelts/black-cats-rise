import type { GameStorage } from "./types";
import { makePlayerNames } from "./utils/makePlayerNames";

export class Game {
  storage: GameStorage;

  constructor(storage: GameStorage) {
    this.storage = storage;
    this.storage.playerNames = makePlayerNames();
  }

  getPlayerNames() {
    return this.storage.playerNames;
  }
}
