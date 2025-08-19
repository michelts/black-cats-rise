const firstNames = 'João José António Carlos Pedro Lucas Luís Marcos Gabriel Rafael Daniel Marcelo Bruno Felipe Ricardo Rodrigo André Juan Marco Leo Hugo Martin Mateo Pablo Alex Mario David Diego Javier John Paul Mark Michael Peter Stefan Klaus Luca'.split(' ');
const lastNames = 'Silva Santos Costa Pereira Oliveira Almeida Ferreira Alves Gomes Rodrigues Martins Sousa Castro Dias Fernandes Nunes Lopes Marques Mendes Pinto Cardoso Teixeira Smith Jones Muller Schmidt Rossi Ferrari Baker Hill Weber Ricci'.split(' ');

export function makePlayerNames() {
  return shuffle([...generatePlayerNames(firstNames, lastNames)])
}

export function* generatePlayerNames(firstNames: string[], lastNames: string[]) {
  for (const first of firstNames) {
    for (const last of lastNames) {
      yield `${first} ${last}`;
    }
  }
}

function shuffle<T>(originalItems: T[]) {
  const shuffledItems = [...originalItems];
  let currentIndex = shuffledItems.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // swap positions
    [shuffledItems[currentIndex], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[currentIndex],
    ];
  }
  return shuffledItems;
}

console.log(makePlayerNames())
