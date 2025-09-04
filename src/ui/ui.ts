import { formations } from "@/core/formations";
import { turnTimeout } from "@/core/game";
import type { Formation, Game, Match, Screen } from "@/types";

let matchInterval: ReturnType<typeof setTimeout> | null = null;
let currentTeam: number;

export function makeUserInterface(game: Game) {
  // reset state
  currentTeam = game.userTeam.id;
  matchInterval = null;

  for (const elem of document.querySelectorAll(".menu")) {
    elem.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const screen = target.dataset.id as Screen;
      navigate(game, screen);
    });
  }
  navigate(game, "splash");
  document.body.style.visibility = "visible";
}

function navigate(game: Game, screen: Screen, extraData?: unknown) {
  const screenContainer = toggleScreen(screen);
  updateClock(game);

  if (screen !== "live" && matchInterval) {
    clearInterval(matchInterval);
  }

  if (screen === "game") {
    navigate(game, "matches");
  }

  if (screen === "matches" && screenContainer) {
    renderMatches(game, screenContainer);
  }

  if (screen === "team" && screenContainer) {
    renderTeam(game, screenContainer);
  }

  if (screen === "live" && screenContainer) {
    renderLiveGame(game, screenContainer, extraData);
  }

  if (screen === "table" && screenContainer) {
    renderTable(game, screenContainer);
  }
}

function updateClock(game: Game) {
  const placeholder = document.querySelector("#clock") as HTMLElement;
  placeholder.innerHTML = game.currentDate.toLocaleDateString();
}

function renderMatches(game: Game, container: HTMLElement) {
  container.innerHTML =
    "<select id=sel-teams>" +
    game.teams.map(
      (team) =>
        "<option value='" +
        team.id +
        "'" +
        (team.id === currentTeam ? " selected" : "") +
        ">" +
        team.name +
        (team.id === game.userTeam.id ? " (you)" : "") +
        "</option>",
    ) +
    "</select><table><tr><th>#</th><th>Home</th><th>Away</th><th>Date</th><th></th></tr>" +
    game.matches
      .filter((match) => match.teamIds.includes(currentTeam))
      .map((match) => {
        return `
<tr>
<td>${match.round}</td>
<td${match.teams[0].id === currentTeam ? " class=bold" : ""}>${match.teams[0].name}</td>
<td${match.teams[1].id === currentTeam ? " class=bold" : ""}>${match.teams[1].name}</td>
<td>${match.date.toLocaleDateString()}</td>
<td>${match.isDone ? match.goals[0] + "x" + match.goals[1] : match.isCurrent ? ("<button data-round=" + match.round + ">" + (match.isPending ? "Begin" : "Continue") + "</button>") : ""}</td>
</tr>`;
      })
      .join("") +
    "</table>";
  document
    .querySelector<HTMLElement>("[data-round]")
    ?.addEventListener("click", (event) => {
      const round = (event.target as HTMLElement).dataset.round;
      if (round) {
        navigate(game, "live", round);
      }
    });
  document.querySelector("#sel-teams")?.addEventListener("change", (event) => {
    currentTeam = Number((event.target as HTMLSelectElement).value);
    renderMatches(game, container);
    (event.target as HTMLSelectElement).focus();
  });
}

function renderLiveGame(game: Game, container: HTMLElement, round: unknown) {
  let match = game.matches.find((match) => match.round === Number(round));
  if (!match) {
    return;
  }
  container.innerHTML =
    "<button data-start" +
    (!match.isPending ? " disabled" : "") +
    ">Start</button>" +
    "<div>Possession: <strong id=ball>-</strong></div><div>Time: <strong id=matchTime>-</strong><div>Score: <strong id=score>-</strong></div>";
  const start = document.querySelector("[data-start]");

  const begin = (match: Match) => {
    start?.setAttribute("disabled", "");
    matchInterval = setInterval(() => {
      if (!match.isLive) {
        if (matchInterval) {
          clearInterval(matchInterval);
        }
        return;
      }
      match = match.advance();
      updateLiveGame(match);
      if (match.isDone) {
        renderLiveGame(game, container, round);
      }
    }, turnTimeout);
  };

  if (match.isPending) {
    start!.addEventListener("click", () => {
      match = match!.advance();
      updateLiveGame(match);
      begin(match);
    });
  } else {
    updateLiveGame(match);
    if (match.isLive) {
      begin(match); // continue game
    }
  }
}

function updateLiveGame(match: Match) {
  const ball = document.querySelector("#ball");
  ball!.innerHTML = String(match.turns[0].ballPosition);
  const matchTime = document.querySelector("#matchTime");
  matchTime!.innerHTML = match.turns[0].time + "min";
  const score = document.querySelector("#score");
  score!.innerHTML = match.goals.join("x");
}

function renderTeam(game: Game, container: HTMLElement) {
  const team = game.userTeam;
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
        (player, index) =>
          "<tr data-idx='" +
          index +
          "' draggable=true class=" +
          (player.pos ?? "re") +
          "><td>" +
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
      game.userTeam.setFormation(value);
      renderTeam(game, container);
      (event.target as HTMLSelectElement).focus();
    });
  for (const row of document.querySelectorAll('tr[draggable="true"]')) {
    row.addEventListener("dragstart", (evt) => {
      (evt as DragEvent).dataTransfer?.setData(
        "text/plain",
        (evt.target as HTMLTableRowElement).dataset.idx ?? "",
      );
    });
    row.addEventListener("dragenter", (evt) => {
      evt.preventDefault();
      row.classList.add("over");
    });
    row.addEventListener("dragover", (evt) => {
      evt.preventDefault();
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("over");
    });
    row.addEventListener("drop", (evt) => {
      evt.preventDefault();
      row.classList.remove("over");
      const orig = (evt as DragEvent).dataTransfer?.getData("text/plain");
      const dest = (evt.target as HTMLElement).closest("tr")?.dataset.idx;
      if (orig && dest) {
        game.userTeam.swapPlayers(Number(orig), Number(dest));
        renderTeam(game, container);
      }
    });
  }
}

function renderTable(game: Game, container: HTMLElement) {
  container.innerHTML =
    "<table><tr><th>Id</th><th>Club</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>" +
    game.table
      .map(
        (record) =>
          "<tr" +
          (record.id === game.userTeam.id ? ' class="bold"' : "") +
          "><td>" +
          record.id +
          "</td><td>" +
          record.name +
          (record.id === game.userTeam.id ? " (you)" : "") +
          "</td><td>" +
          record.mp +
          "</td><td>" +
          record.w +
          "</td><td>" +
          record.d +
          "</td><td>" +
          record.l +
          "</td><td>" +
          record.f +
          "</td><td>" +
          record.a +
          "</td><td>" +
          record.gd +
          "</td><td>" +
          record.pts +
          "</td></tr>",
      )
      .join("") +
    "</table>";
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
