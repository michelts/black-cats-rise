import { Game } from "@/core/game";
import { makeStorage } from "@/storage";
import { UserInterface } from "@/ui/ui";
import "../style/style.css";

function main() {
  const storage = makeStorage();
  const game = new Game(storage);
  const ui = new UserInterface({
    onNavigate(router, screen, elem) {
      if (screen === "game") {
        router.navigate("table");
      }
      if (screen === "table") {
        const players = game.getPlayerNames();
        if (players) {
          elem!.innerHTML =
            "<ul>" +
            players.map((player) => `<li>${player}</li>`).join("") +
            "</ul>";
        }
      }
    },
  });
  ui.activate();
  ui.updateTime(game.currentDate);
}

main();
