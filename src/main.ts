import { Game } from "./game";
import { Router } from "./router";
import { makeStorage } from "./storage";
import "../style/style.css";

function main() {
  const storage = makeStorage();
  const router = new Router();
  router.activate({
    onClick: (router, screen) => {
      if (screen === "game") {
        new Game(storage);
        router.navigate("matches");
        console.log("ok");
      }
    },
  });
}

main();
