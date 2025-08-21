import { Game } from "./game";
import { makeStorage } from "./storage";

const storage = makeStorage();
let game: Game | null = null;

function main() {
  document
    .querySelector("#splash button")
    ?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      console.log(`Clicked on: ${target.textContent}`);
      game = new Game(storage);
      swapScreen("#game");
      console.log(game.getPlayerNames());
    });
}

function swapScreen(id: string) {
  for (const elem of document.querySelectorAll<HTMLDivElement>(".screen")) {
    elem.style.display = "none";
  }
  const elem = document.querySelector<HTMLDivElement>(id);
  if (elem) {
    elem.style.display = "block";
  }
}

main();
