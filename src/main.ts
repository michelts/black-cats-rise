function main() {
  console.log("Black Cat's Rise");

  document
    .querySelector("#splash-screen nav")
    ?.addEventListener("click", (event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === "A") {
        event.preventDefault();
        console.log(`Clicked on: ${target.textContent}`);
        // Here you could hide the splash screen and start the game,
        // or navigate to another screen.
      }
    });
}

main();
