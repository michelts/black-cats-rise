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
        const game = new Game(storage);
        console.log(game.getPlayerNames());
        // Show the team screen by adding the active class
        const teamScreen = document.getElementById("teams-screen");
        if (teamScreen) {
          teamScreen.classList.add("active");
        }
        // Render teams list
        displayTeams("teamlist");
      }
    },
  });
}

main();
