import type { Screen } from "./types";

type ClickHandler = (router: Router, screen: Screen) => void;
type ActivateHandler = (
  router: Router,
  screen: Screen,
  elem: HTMLElement,
) => void;

export class Router {
  onActivate: ActivateHandler;

  constructor({
    onClick,
    onActivate,
  }: {
    onClick: ClickHandler;
    onActivate: ActivateHandler;
  }) {
    this.onActivate = onActivate;

    for (const elem of document.querySelectorAll(".menu")) {
      elem.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const screen = target.dataset.id as Screen;
        this.navigate(screen);
        onClick(this, screen);
      });
    }
  }

  activate() {
    this.navigate("splash");
    document.body.style.visibility = "visible";
  }

  navigate(screen: Screen) {
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
        this.onActivate(this, screen, elem);
      }
    }
  }
}
