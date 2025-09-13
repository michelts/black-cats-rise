import { Game } from "@/core/game";
import { makeStorage } from "@/storage";
import { makeUserInterface } from "@/ui/ui";
import "../style/style.scss";

const userTeamId = 0;
const storage = makeStorage();
if (storage.teams) {
  const button = document.getElementById("continue");
  button?.classList.remove("hide");
}
const game = new Game(userTeamId, storage);
makeUserInterface(game);
