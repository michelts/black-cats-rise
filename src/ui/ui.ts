import { formations } from "@/core/formations";
import { boostTurns, turnTimeout } from "@/core/game";
import type {
  Formation,
  Game,
  Kit,
  Match,
  Player,
  Position,
  Screen,
  StoredTurn,
  Strategy,
  Team,
} from "@/types";

let matchInterval: ReturnType<typeof setTimeout> | null = null;
let currentTeam: number;
let currentLiveTeamIndex: 0 | 1 | undefined;

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
    return;
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

  document.getElementsByTagName("main")[0].scrollTop = 0;
}

function renderMatches(game: Game, container: HTMLElement) {
  const choices: Array<[string, string]> = game.teams.map((team) => [
    "" + team.id,
    team.name,
  ]);
  const matches = game.matches.filter((match) =>
    match.teamIds.includes(currentTeam),
  );
  const currentMatch = matches.find((match) => match.isCurrent);
  container.innerHTML =
    (currentMatch
      ? renderHeader("Next Match", "") + renderNextMatch(currentMatch)
      : "") +
    renderHeader(
      "Full Fixtures",
      renderSelect(
        "view-team",
        "View Team",
        choices,
        "" + currentTeam,
        (value) => {
          currentTeam = Number(value);
          renderMatches(game, container);
        },
      ),
    ) +
    renderFullFixtures(matches, game.userTeam);
  document
    .querySelector<HTMLElement>("[data-round]")
    ?.addEventListener("click", (event) => {
      const round = (event.target as HTMLElement).dataset.round;
      if (round) {
        navigate(game, "live", round);
      }
    });
}

function renderNextMatch(match: Match) {
  return (
    "<div class=nm><div><div><b>" +
    renderTeamName(match.teams[0]) +
    "</b><span>Home</span></div><span>" +
    tShirt(match.teams[0].kit) +
    "vs" +
    tShirt(match.teams[1].kit) +
    "</span><div><b>" +
    renderTeamName(match.teams[1]) +
    "</b><span>Away</span></div></div><div><button class=btn data-round=" +
    match.round +
    ">" +
    (match.isPending ? "Begin" : "Continue") +
    " Match" +
    "</button></div></div>"
  );
}

function renderFullFixtures(matches: Match[], userTeam: Team) {
  return (
    "<table>" +
    matches
      .map((match) => {
        return (
          "<tr><td class='r fif'>" +
          renderTeamName(
            match.teams[0],
            match.teams[0].id === userTeam.id ? "bold" : "",
          ) +
          "</td><td class=cll>" +
          tShirt(match.teams[0].kit) +
          "</td><td class='c cll'>" +
          (match.isPending
            ? match.date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            : "<b>" + match.goals.join("x") + "</b>") +
          "</td><td class=cll>" +
          tShirt(match.teams[1].kit) +
          "</td><td class=fif>" +
          renderTeamName(
            match.teams[1],
            match.teams[1].id === userTeam.id ? "bold" : "",
          ) +
          "</td></tr>"
        );
      })
      .join("") +
    "</table>"
  );
}

function renderLiveGame(game: Game, container: HTMLElement, round: unknown) {
  let match = game.matches.find((match) => match.round === Number(round));
  if (!match) {
    return;
  }

  if (currentLiveTeamIndex === undefined) {
    currentLiveTeamIndex = match.teams.findIndex(
      (team) => team.id === game.userTeam.id,
    ) as 0 | 1;
  }
  const teamForFormation = match.teams[currentLiveTeamIndex];
  const teamIndex = match.teamIds.indexOf(game.userTeam.id);
  const [currentStrategy, strategyTurns] = match.strategy[teamIndex];
  container.innerHTML =
    "<div class=lg>" +
    renderLiveGameHeader(...match.teams) +
    renderLiveGameFormation(
      match,
      teamForFormation,
      teamForFormation.id === match.teams[0].id,
      teamForFormation.id !== game.userTeam.id,
      renderLiveGameFormationChangeControl(game),
      (player) => {
        return match?.boostPlayer(player)!;
      },
    ) +
    renderLiveGameProgress(...match.teams) +
    renderLiveGameStrategy(
      currentStrategy,
      strategyTurns,
      (strategy: Strategy) => {
        if (match?.isLive) {
          return match!.setStrategy(game.userTeam.id, strategy);
        }
      },
    ) +
    renderLiveGameSidebar(match.turns) +
    "</div>";
  const start = getById("start");
  const score = getById("score");
  const time = getById("matchTime");
  if (!match.isPending) {
    score.classList.remove("hide");
    time.classList.remove("hide");
  } else {
    start.classList.remove("hide");
  }

  const begin = (match: Match) => {
    start.classList.add("hide");
    score.classList.remove("hide");
    time.classList.remove("hide");
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
        reRenderLiveGame(game, container, round);
        currentLiveTeamIndex = undefined;
      }
    }, turnTimeout);
  };

  if (match.isPending) {
    start.addEventListener("click", () => {
      match = match!.advance();
      reRenderLiveGame(game, container, round);
    });
  } else {
    updateLiveGame(match);
    if (match.isLive) {
      begin(match); // continue game
    }
  }

  // set current-live-game
  document.querySelectorAll<HTMLElement>("[data-setclt]").forEach((element) => {
    element.addEventListener("click", () => {
      currentLiveTeamIndex = Number(element.dataset.setclt) as 0 | 1;
      reRenderLiveGame(game, container, round);
    });
  });
}

function reRenderLiveGame(game: Game, container: HTMLElement, round: unknown) {
  if (matchInterval) {
    clearInterval(matchInterval);
  }
  renderLiveGame(game, container, round);
}

function renderLiveGameHeader(home: Team, away: Team) {
  return (
    '<div class="lgh">' +
    "<button class='t " +
    (currentLiveTeamIndex === 0 ? "a" : "") +
    "' data-setclt=0>" +
    renderTeamName(home) +
    "</button>" +
    tShirt(home.kit) +
    "<div class=score-w>" +
    "<button id=start class='btn hide'>Start</button>" +
    "<strong id=score class=hide></strong>" +
    "<span id=matchTime class=hide></span>" +
    "</div>" +
    tShirt(away.kit) +
    "<button class='t " +
    (currentLiveTeamIndex === 1 ? "a" : "") +
    "' data-setclt=1>" +
    renderTeamName(away) +
    "</button>" +
    "</div>"
  );
}

function renderLiveGameFormation(
  match: Match,
  team: Team,
  isHome: boolean,
  disabled: boolean,
  suffix: string,
  onClickPlayer: (player: Player["number"]) => number,
) {
  const allPlayers = team.players.slice(1); // without gk
  const formation = team.formation.split("-").map(Number);
  const content =
    "<div class=lgfw><div class='lgf " +
    (!isHome ? "rev" : "") +
    "'><b>Defense</b><div>" +
    formation
      .map((count) => {
        const players = allPlayers.splice(0, count);
        return (
          "<div class=fmt>" +
          players
            .map((player, index) => {
              let prefix = "";
              if (players.length > 4 && players.length < 6 && index === 3) {
                prefix = "<span></span>";
              }
              if (players.length === 6 && index === 3) {
                prefix = "<span></span>";
              }
              const button = renderPlayerInGame(
                player,
                disabled,
                match.boost[player.number],
                match.isLive ? onClickPlayer : () => 0,
              );
              return prefix + button;
            })
            .join("") +
          "</div>"
        );
      })
      .join("") +
    "</div><b>Attack</b></div>" +
    suffix +
    "</div>";
  return content;
}

function renderLiveGameFormationChangeControl(game: Game) {
  setTimeout(() => {
    getById("fmt-c").addEventListener("click", () => {
      navigate(game, "team");
    });
  });
  return '<button id=fmt-c class="btn">Change Formation</button>';
}

function renderPlayerInGame(
  player: Player,
  disabled: boolean,
  boost: number,
  onClickPlayer: (player: Player["number"]) => number,
) {
  let attrs = "class='" + player.pos;
  if (boost) {
    attrs += " ld"; // loading
  }
  if (!disabled) {
    attrs += "'";
  } else {
    attrs += " ds' disabled";
  }
  const button =
    "<button id='p" +
    player.number +
    "' " +
    attrs +
    ">" +
    player.number +
    "</button>";
  if (!disabled) {
    setTimeout(() => {
      const element = getById("p" + player.number);
      if (boost) {
        startAnimation(boost);
      }

      element.addEventListener("click", () => {
        const newBoost = onClickPlayer(player.number);
        if (!newBoost) {
          return;
        }
        startAnimation(newBoost);
      });

      function startAnimation(boost: number) {
        const duration = boostTurns * turnTimeout;
        const delta = (boostTurns - boost) * turnTimeout;
        const zero = (document.timeline.currentTime as number) - delta;
        requestAnimationFrame(animate);
        function animate(timestamp: number) {
          if (
            !element.isConnected ||
            element.getBoundingClientRect().width === 0
          ) {
            return;
          }
          const value = (timestamp - zero) / duration;
          element.style.setProperty("--p", "" + value * 100);
          if (value < 1) {
            requestAnimationFrame((t) => animate(t));
          } else {
            element.style.setProperty("--p", "0");
          }
        }
      }
    });
  }

  return button;
}

function renderLiveGameProgress(home: Team, away: Team) {
  const color1 = home.kit.color1;
  const color2 =
    away.kit.color1 !== home.kit.color1 ? away.kit.color1 : away.kit.color2;
  return (
    "<div class=lgp style='--c1: " +
    color1 +
    "; --c2: " +
    color2 +
    "'><div id=ball><span>⚽</span></div></div>"
  );
}

function renderLiveGameStrategy(
  currentStrategy: Strategy,
  strategyTurns: number,
  callback: (strategy: Strategy) => [Strategy, number] | undefined,
) {
  const strategies: [string, string[], Strategy][] = [
    ["All Out Attack", ["+att", "-def"], "att"],
    ["Park the Bus", ["+def", "-att"], "prk"],
    ["Pressure Up", ["+def", "cntr att"], "prss"],
  ] as const;
  setTimeout(() => {
    document.querySelectorAll<HTMLElement>("[data-stg]").forEach((elem) => {
      elem.addEventListener("click", () => {
        const result = callback(elem.dataset.stg as Strategy);
        if (!result) {
          return;
        }
        const [newStrategy, newTurns] = result;
        getById("lgst").outerHTML = renderLiveGameStrategy(
          newStrategy,
          newTurns,
          callback,
        );
        // live game strategy action
        startAnimation(getById("lgst-a"), newTurns);
      });
    });
    function startAnimation(container: HTMLElement, turns: number) {
      const duration = turns * turnTimeout;
      const delta = (boostTurns - turns) * turnTimeout;
      const zero = (document.timeline.currentTime as number) - delta;
      requestAnimationFrame(animate);
      function animate(timestamp: number) {
        if (
          !container.isConnected ||
          container.getBoundingClientRect().width === 0
        ) {
          return;
        }
        const value = (timestamp - zero) / duration;
        container.style.setProperty("--p", "" + value * 100);
        if (value < 1) {
          requestAnimationFrame((t) => animate(t));
        } else {
          container.style.setProperty("--p", "100");
          getById("lgst").outerHTML = renderLiveGameStrategy("", 0, callback);
        }
      }
    }
  });
  return (
    "<div id=lgst><div class=c><b>Strategy</b></div><div class=lgst-b>" +
    strategies
      .map(
        ([label, effects, strategy]) =>
          "<button " +
          (currentStrategy === strategy && strategyTurns ? "id=lgst-a " : "") +
          (strategyTurns ? "disabled " : "") +
          "data-stg=" +
          strategy +
          " class='btn" +
          (currentStrategy === strategy && strategyTurns ? " ld" : "") +
          "'><b>" +
          label +
          "</b> " +
          effects.map((ef) => "<span>" + ef + "</span>").join("") +
          "</button>",
      )
      .join("") +
    "</div></div>"
  );
}

function renderLiveGameSidebar(turns: StoredTurn[]) {
  const sidebar =
    "<div class=lgs><div class=c><b>Match Events</b></div><div id=lgs-ms>" +
    turns
      .filter((turn) => turn.evt)
      .reverse()
      .map(renderTurnMessage)
      .join("") +
    "</div></div>";
  return sidebar;
}

function renderTurnMessage(turn: StoredTurn) {
  const isGoal = turn.goals.some((goal) => goal);
  return (
    "<div id=tm-" +
    turn.id +
    "><div class=tm>" +
    turn.time +
    "'</div> " +
    "<div class='" +
    (isGoal ? "hm" : "") +
    "'>" +
    turn.evt +
    "</div></div>"
  );
}

function updateLiveGame(match: Match) {
  const ball = getById("ball");
  const turn = match.turns[0]!;
  ball.style.setProperty("--pct", turn.ballPosition.toFixed(0) + "%");
  const matchTime = getById("matchTime");
  matchTime.innerHTML = turn.time + "min";
  const score = getById("score");
  score.innerHTML = match.goals.join("x");
  if (turn.evt) {
    const sidebar = getById("lgs-ms");
    const lastTurnMessageId = (sidebar.lastChild as HTMLElement)?.getAttribute(
      "id",
    );
    if (lastTurnMessageId !== "tm-" + turn.id) {
      sidebar.innerHTML += renderTurnMessage(turn);
    }
  }
}

function renderTeam(game: Game, container: HTMLElement) {
  const team = game.userTeam;
  const choices: Array<[string, string]> = formations.map((formation) => [
    formation,
    formation,
  ]);
  container.innerHTML =
    renderHeader(
      "Your Squad",
      renderSelect(
        "change-formation",
        "Change Formation",
        choices,
        team.formation,
        (value) => {
          game.userTeam.setFormation(value as Formation);
          renderTeam(game, container);
        },
      ),
    ) +
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
    renderHeader("League Table", "") +
    "<table><tr><th>POS</th><th>Club</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>PTS</th></tr>" +
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
    team.name.slice(0, 5) +
    "<span class=sr>" +
    team.name.slice(5) +
    "</span>" +
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

function renderHeader(title: string, content: string) {
  return "<header><h2>" + title + "</h2>" + content + "</header>";
}
