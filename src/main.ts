function main() {
  document
    .querySelector("#splash-screen nav")
    ?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        console.log(`Clicked on: ${target.textContent}`);
        // Here you could hide the splash screen and start the game,
        // or navigate to another screen.
      }
    });
}

main();
