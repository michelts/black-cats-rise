import { Game } from "./game";
import { LocalStorage } from "./storage";

let game: Game | null = null;
const storage = new LocalStorage();

function main() {
  document
    .querySelector("#splash button")
    ?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      console.log(`Clicked on: ${target.textContent}`);
      game = new Game(storage);
      swapScreen("#game");
      console.log(storage.playerNames);
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
