import type { Screen } from "@/types";

type NavigateHandler = (
  router: UserInterface,
  screen: Screen,
  elem: HTMLElement | null,
) => void;

export class UserInterface {
  onNavigate: NavigateHandler;

  constructor({
    onNavigate,
  }: {
    onNavigate: NavigateHandler;
  }) {
    this.onNavigate = onNavigate;

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

  navigate(screen: Screen) {
    for (const elem of document.querySelectorAll<HTMLDivElement>(
      ".screen, .menu",
    )) {
      elem.classList.remove("active");
    }
    let container: HTMLElement | null = null;
    for (const elem of document.querySelectorAll<HTMLElement>(
      `#${screen}, [data-id=${screen}]`,
    )) {
      elem.classList.add("active");
      if (elem.tagName !== "BUTTON") {
        container = elem;
      }
    }
    this.onNavigate(this, screen, container);
  }

  updateTime(date: Date) {
    const placeholder = document.querySelector(
      "#date-placeholder",
    ) as HTMLElement;
    placeholder.innerHTML = date.toLocaleDateString();
  }
}
