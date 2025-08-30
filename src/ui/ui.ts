import { formations } from "@/core/formations";
import type { Formation, Game, Screen } from "@/types";

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

  navigate(screen: Screen, extraData?: unknown) {
    const screenContainer = toggleScreen(screen);
    this.renderTime(this.game.currentDate);
    if (screen === "game") {
      this.navigate("matches");
    }
    if (screen === "matches" && screenContainer) {
      this.renderMatches(screenContainer);
    }
    if (screen === "team" && screenContainer) {
      this.renderTeam(screenContainer);
    }
    if (screen === "live" && screenContainer) {
      this.renderLiveGame(screenContainer, extraData);
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
      "<select id=sel-teams>" +
      this.game.teams.map(
        (team) =>
          "<option value='" +
          team.id +
          "'" +
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
          this.navigate("live", round);
        }
      });
    document
      .querySelector("#sel-teams")
      ?.addEventListener("change", (event) => {
        this.currentTeam = Number((event.target as HTMLSelectElement).value);
        this.renderMatches(container);
        (event.target as HTMLSelectElement).focus();
      });
  }

  renderLiveGame(container: HTMLElement, round: unknown) {
    container.innerHTML = "<button data-start>Start</button>";
    document.querySelector("[data-start]")?.addEventListener("click", () => {
      const match = this.game.matches.find(
        (match) => match.round === Number(round),
      );
      if (match) {
        match.play();
        this.navigate("matches");
      }
    });
  }

  renderTeam(container: HTMLElement) {
    const team = this.game.teams[this.currentTeam];
    container.innerHTML =
      "<select id=sel-formation>" +
      formations.map(
        (formation) =>
          "<option value='" +
          formation +
          "'" +
          (formation === team.formation ? " selected" : "") +
          ">" +
          formation +
          "</option>",
      ) +
      "</select><table><tr><th>#<th>Pos</th><th>Name</th><th>Gk</th><th>Df</th><th>Md</th><th>At</th></tr>" +
      "<ul>" +
      team.players
        .map(
          (player) =>
            "<tr><td>" +
            player.number +
            "<td>" +
            (player.pos ?? "re") +
            "</td><td>" +
            player.name +
            "</td><td>" +
            player.gk +
            "</td><td>" +
            player.df +
            "</td><td>" +
            player.md +
            "</td><td>" +
            player.at +
            "</td></tr>",
        )
        .join("") +
      "</ul>";
    document
      .querySelector("#sel-formation")
      ?.addEventListener("change", (event) => {
        const value = (event.target as HTMLSelectElement).value as Formation;
        this.game.setTeamFormation(this.currentTeam, value);
        this.renderTeam(container);
        (event.target as HTMLSelectElement).focus();
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
