import { Game } from "@/core/game";
import { makeStorage } from "@/storage";
import { UserInterface } from "@/ui/ui";
import "../style/style.css";

function main() {
  const storage = makeStorage();
  let game: Game | null = null;
  const ui = new UserInterface({
    onClick: (router, screen) => {
      if (screen === "game") {
        game = new Game(storage);
        router.navigate("table");
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
  ui.activate();
  setInterval(() => {
    const placeholder = document.querySelector(
      "#date-placeholder",
    ) as HTMLElement;
    placeholder.innerHTML = new Date().toLocaleDateString();
  });
}

main();
