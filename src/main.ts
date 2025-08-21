import { Game } from "./game";
import { Router } from "./router";
import { makeStorage } from "./storage";
import "../style/style.css";

function main() {
  const storage = makeStorage();
  let game: Game | null = null;
  const router = new Router({
    onClick: (router, screen) => {
      if (screen === "game") {
        game = new Game(storage);
        router.navigate("matches");
      }
    },
    onActivate: (_, screen, elem) => {
      if (screen === "matches") {
        const players = game?.getPlayerNames();
        if (players) {
          elem.innerHTML =
            "<ul>" +
            players.map((player) => `<li>${player}</li>`).join("") +
            "</ul>";
        }
      }
    },
  });
  router.activate();
  setInterval(() => {
    const placeholder = document.querySelector(
      "#date-placeholder",
    ) as HTMLElement;
    placeholder.innerHTML = new Date().toLocaleDateString();
  });
}

main();
