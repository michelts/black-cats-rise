import type { Game, Screen } from "@/types";

export class UserInterface {
  game: Game;
  currentTeam = 0;

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
    const screenContainer = toggleScreen(screen);
    if (screen === "game") {
      this.renderTime(this.game.currentDate);
      this.navigate("matches");
    }
    if (screen === "matches" && screenContainer) {
      this.renderMatches(screenContainer);
    }
    if (screen === "table" && screenContainer) {
      this.renderTable(screenContainer);
    }
  }

  renderTime(date: Date) {
    const placeholder = document.querySelector(
      "#date-placeholder",
    ) as HTMLElement;
    placeholder.innerHTML = date.toLocaleDateString();
  }

  renderMatches(container: HTMLElement) {
    container.innerHTML =
      "<select>" +
      this.game.teams.map(
        (team) =>
          "<option" +
          (team.id === this.currentTeam ? " selected" : "") +
          ">" +
          team.name +
          "</option>",
      ) +
      "</select><table><tr><th>#</th><th>Home</th><th>Away</th><th>Date</th><th></th></tr>" +
      this.game.matches
        .filter((match) => match.teamIds.includes(this.currentTeam))
        .map((match) => {
          return `
<tr>
<td>${match.round}</td>
<td>${match.teams[0].name}</td>
<td>${match.teams[1].name}</td>
<td>${match.date.toLocaleDateString()}</td>
<td>${match.goals ? match.goals[0] + "x" + match.goals[1] : match.isCurrent ? "<button data-round=" + match.round + ">Begin</button>" : ""}</td>
</tr>`;
        })
        .join("") +
      "</table>";
    document
      .querySelector<HTMLElement>("[data-round]")
      ?.addEventListener("click", (event) => {
        const round = (event.target as HTMLElement).dataset.round;
        if (round) {
          const match = this.game.matches.find(
            (match) => match.round === Number(round),
          );
          match?.play();
          this.renderMatches(container);
        }
      });
    document.querySelector("select")?.addEventListener("change", (event) => {
      this.currentTeam = (event.target as HTMLSelectElement).selectedIndex;
      this.renderMatches(container);
      document.querySelector("select")?.focus();
    });
  }

  renderTable(container: HTMLElement) {
    container.innerHTML =
      "<table><tr><th>Id</th><th>Club</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>" +
      this.game.teams
        .map(
          (team) =>
            `<tr><td>${team.id}</td><td>${team.name}</td><td>${team.mp}</td><td>${team.w}</td><td>${team.d}</td><td>${team.l}</td><td>${team.f}</td><td>${team.a}</td><td>${team.gd}</td><td>${team.pts}</td></tr>`,
        )
        .join("") +
      "</table>";
  }
}

function toggleScreen(screen: Screen) {
  for (const elem of document.querySelectorAll<HTMLDivElement>(
    ".screen, .menu",
  )) {
    elem.classList.remove("active");
  }
  for (const elem of document.querySelectorAll<HTMLElement>(
    `#${screen}, [data-id=${screen}]`,
  )) {
    elem.classList.add("active");
    if (elem.tagName !== "BUTTON") {
      return elem;
    }
  }
  return null;
}
