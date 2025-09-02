import { Game } from "@/core/game";
import { makeStorage } from "@/storage";
import { makeUserInterface } from "@/ui/ui";
import "../style/style.scss";

const userTeamId = 0;
const storage = makeStorage();
const game = new Game(userTeamId, storage);
game.reset();
makeUserInterface(game);
