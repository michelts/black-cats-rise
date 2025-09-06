import { formations } from "@/core/formations";
import { turnTimeout } from "@/core/game";
import type {
  Formation,
  Game,
  Kit,
  Match,
  Position,
  Screen,
  Team,
} from "@/types";

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

function renderMatches(game: Game, container: HTMLElement) {
  const choices: Array<[string, string]> = game.teams.map((team) => [
    "" + team.id,
    team.name,
  ]);
  container.innerHTML =
    "<header>" +
    "<h2>Full Fixtures</h2>" +
    renderSelect(
      "view-team",
      "View Team",
      choices,
      "" + currentTeam,
      (value) => {
        currentTeam = Number(value);
        renderMatches(game, container);
      },
    ) +
    "</header>" +
    "<table>" +
    game.matches
      .filter((match) => match.teamIds.includes(currentTeam))
      .map((match) => {
        return (
          "<tr><td class=r>" +
          renderTeamName(
            match.teams[0],
            match.teams[0].id === game.userTeam.id ? "bold" : "",
          ) +
          "</td><td class=cll>" +
          tShirt(match.teams[0].kit) +
          "</td><td class=c>" +
          match.date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }) +
          "</td><td class=cll>" +
          tShirt(match.teams[1].kit) +
          "</td><td>" +
          renderTeamName(
            match.teams[1],
            match.teams[1].id === game.userTeam.id ? "bold" : "",
          ) +
          "</td></tr>"
        );
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
  const choices: Array<[string, string]> = formations.map((formation) => [
    formation,
    formation,
  ]);
  container.innerHTML =
    "<header><h2>Your Squad</h2>" +
    renderSelect(
      "change-formation",
      "Change Formation",
      choices,
      team.formation,
      (value) => {
        game.userTeam.setFormation(value as Formation);
        renderTeam(game, container);
      },
    ) +
    "</header>" +
    "<table><tr><th></th><th>#<th>POS</th><th>NAME</th><th>GK</th><th>DF</th><th>MD</th><th>AT</th></tr>" +
    team.players
      .map(
        (player, index) =>
          "<tr title='Drag to swap positions' data-idx='" +
          index +
          "' draggable=true class=" +
          (player.pos ?? "sub") +
          "><td>⠿</td><td>" +
          player.number +
          "<td>" +
          renderPosition(player.pos) +
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
    "</table>";
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
    "<header><h2>League Table</h2></header><table><tr><th>POS</th><th>Club</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>PTS</th></tr>" +
    game.table
      .map(
        (record, index) =>
          "<tr" +
          (record.team.id === game.userTeam.id ? ' class="bold"' : "") +
          "><td>" +
          index +
          "</td><td>" +
          renderTeamName(
            record.team,
            record.team.id === game.userTeam.id ? "bold" : "",
            tShirt(record.team.kit),
          ) +
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

function renderSelect(
  id: string,
  label: string,
  options: Array<[string, string]>,
  selected: string,
  callback: (value: string) => void,
) {
  const select =
    "<div><label>" +
    label +
    ":</label>" +
    "<select id=" +
    id +
    ">" +
    options
      .map(
        ([value, label]) =>
          "<option value=" +
          value +
          (value === selected ? " selected" : "") +
          ">" +
          label +
          "</option>",
      )
      .join("") +
    "</select></div>";
  setTimeout(() => {
    getById(id).addEventListener("change", (event) => {
      const value = (event.target as HTMLSelectElement).value;
      callback(value);
      regainFocus(id);
    });
  });
  return select;
}

function getById(id: string): HTMLElement {
  const elem = document.querySelector<HTMLElement>("#" + id);
  if (!elem) {
    throw new Error();
  }
  return elem;
}

function regainFocus(id: string) {
  getById(id).focus();
}

function renderTeamName(
  team: Team,
  className: string = "",
  prefix: string = "",
) {
  return (
    '<div class="name ' +
    className +
    '">' +
    prefix +
    "<span>" +
    team.name +
    "</span></div>"
  );
}

function tShirt(kit: Kit) {
  return (
    '<i class="tshirt ' +
    kit.pattern[0] +
    '" style="--color1: ' +
    kit.color1 +
    "; --color2: " +
    kit.color2 +
    '"></i>'
  );
}

function renderPosition(position?: Position) {
  const value = position ?? "sub";
  return '<b class="pos">' + value + "</b>";
}
