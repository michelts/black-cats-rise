import { Game } from "./game";
import { Router } from "./router";
import { makeStorage } from "./storage";
import type { Screen } from "./types";

function main() {
  const router = new Router();
  const storage = makeStorage();

  router.onClickMenu({
    onClick: (screen: Screen) => {
      if (screen === "game") {
        new Game(storage);
      }
    },
  });
}

main();
