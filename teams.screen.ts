export function loadTeams(storage: GameStorage): string[] {
  const teamNames = storage.teamNames;
  if (teamNames instanceof Array) {
    return teamNames;
  }
  return [];
}

export function displayTeams(screenId: string): void {
  const element = document.getElementById(screenId);
  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  } else {
    console.error("Cannot find element with id " + screenId);
    return;
  }

  const storage = makeStorage();
  const teams = loadTeams(storage);

  teams.forEach(teamName => {
    const teamElement = document.createElement("div");
    teamElement.textContent = teamName;
    element.appendChild(teamElement);
  });
}
