import { Game } from "./game";

let game: Game | null = null;

function main() {
  document
    .querySelector("#splash button")
    ?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      console.log(`Clicked on: ${target.textContent}`);
      game = new Game();
      swapScreen("#game");
      console.log(game.playerNames);
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
