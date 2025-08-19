const ptEsFirstNames = 'João José António Carlos Pedro Lucas Luís Marcos Gabriel Rafael Daniel Marcelo Bruno Felipe Ricardo Rodrigo André Juan Marco Martin Mateo Pablo Alex Mario David Diego Javier'.split(' ');
const ptEsLastNames = 'Silva Santos Costa Pereira Oliveira Almeida Ferreira Alves Gomes Rodrigues Martins Sousa Castro Dias Fernandes Nunes Lopes Marques Mendes Pinto Cardoso Teixeira'.split(' ');

const enFirstNames = 'John Paul Mark Michael Peter'.split(' ');
const enLastNames = 'Smith Jones Baker Hill'.split(' ');

const deFirstNames = 'Stefan Klaus'.split(' ');
const deLastNames = 'Muller Schmidt Weber'.split(' ');

const itFirstNames = 'Leo Hugo Luca'.split(' ');
const itLastNames = 'Rossi Ferrari Ricci'.split(' ');

export function makePlayerNames() {
  const allNames = [
    ...generatePlayerNames(ptEsFirstNames, ptEsLastNames),
    ...generatePlayerNames(enFirstNames, enLastNames),
    ...generatePlayerNames(deFirstNames, deLastNames),
    ...generatePlayerNames(itFirstNames, itLastNames),
  ];
  return shuffle(allNames);
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
