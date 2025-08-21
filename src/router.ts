import type { Screen } from "./types";

export class Router {
  construtor() {
    this.navigate("splash");
  }

  onClickMenu({ onClick }: { onClick: (screen: Screen) => void }) {
    document.querySelector(".menu")?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const screen = target.dataset.id as Screen;
      this.navigate(screen);
      onClick(screen);
    });
  }

  navigate(id: Screen) {
    for (const elem of document.querySelectorAll<HTMLDivElement>(".screen")) {
      elem.classList.remove("active");
    }
    const elem = document.querySelector<HTMLDivElement>("#" + id);
    if (elem) {
      elem.classList.add("active");
    }
  }
}
