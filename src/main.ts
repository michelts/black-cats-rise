import { Game } from "@/core/game";
import { makeStorage } from "@/storage";
import { UserInterface } from "@/ui/ui";
import "../style/style.scss";

function main() {
  const storage = makeStorage();
  const game = new Game(storage);
  game.reset();
  const ui = new UserInterface(game);
  ui.activate();
}

main();
