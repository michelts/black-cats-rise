import type { Screen } from "./types";

export class Router {
  activate({ onClick }: { onClick: (router: Router, screen: Screen) => void }) {
    this.navigate("splash");
    for (const elem of document.querySelectorAll(".menu")) {
      elem.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const screen = target.dataset.id as Screen;
        this.navigate(screen);
        console.log("Navigate to", screen);
        onClick(this, screen);
      });
    }
    document.body.style.visibility = "visible";
  }

  navigate(id: Screen) {
    console.log("id", id);
    for (const elem of document.querySelectorAll<HTMLDivElement>(
      ".screen, .menu",
    )) {
      elem.classList.remove("active");
    }
    for (const elem of document.querySelectorAll<HTMLElement>(
      `#${id}, [data-id=${id}]`,
    )) {
      elem.classList.add("active");
    }
  }
}
