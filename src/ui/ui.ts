import type { Game, Screen } from "@/types";

export class UserInterface {
  game: Game;

  constructor(game: Game) {
    this.game = game;
    for (const elem of document.querySelectorAll(".menu")) {
      elem.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const screen = target.dataset.id as Screen;
        this.navigate(screen);
      });
    }
  }

  activate() {
    this.navigate("splash");
    document.body.style.visibility = "visible";
  }

  navigate(screen: Screen) {
    for (const elem of document.querySelectorAll<HTMLDivElement>(
      ".screen, .menu",
    )) {
      elem.classList.remove("active");
    }
    let container: HTMLElement | null = null;
    for (const elem of document.querySelectorAll<HTMLElement>(
      `#${screen}, [data-id=${screen}]`,
    )) {
      elem.classList.add("active");
      if (elem.tagName !== "BUTTON") {
        container = elem;
      }
    }
    if (screen === "game") {
      this.updateTime(this.game.currentDate);
      this.navigate("matches");
    }
    if (screen === "matches" && container) {
      this.renderMatches(container);
    }
    if (screen === "table" && container) {
      this.renderTable(container);
    }
  }

  updateTime(date: Date) {
    const placeholder = document.querySelector(
      "#date-placeholder",
    ) as HTMLElement;
    placeholder.innerHTML = date.toLocaleDateString();
  }

  renderMatches(container: HTMLElement) {
    container.innerHTML =
      "<table><tr><th>#</th><th>Home</th><th>Away</th><th>Date</th><th></th></tr>" +
      this.game.matches
        .filter((match) => match.home.teamId === 0 || match.away.teamId === 0)
        .map(
          (match) =>
            `<tr><td>${match.round}<td>${match.home.team.name}</td><td>${match.away.team.name}</td><td>${match.date.toLocaleDateString()}</td><td>${match.isCurrent ? "<button>Begin</button>" : ""}</td></tr>`,
        )
        .join("") +
      "</table>";
  }

  renderTable(container: HTMLElement) {
    container.innerHTML =
      "<table><tr><th>Club</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th></tr>" +
      this.game.teams
        .map(
          (team) =>
            `<tr><td>${team.name}</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>`,
        )
        .join("") +
      "</table>";
  }
}
