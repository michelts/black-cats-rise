const ptEsFirstNames = 'João José Antônio Carlos Pedro Lucas Marcos Rafael Juliano Márcio'.split(' ');
const ptEsLastNames = 'Silva Santos Costa Pereira Oliveira Rodrigues Martins Sousa'.split(' ');

const enFirstNames = 'John Paul Mark Michael Peter David Chris Robert James William'.split(' ');
const enLastNames = 'Smith Jones Baker Hill Taylor Wilson Brown Davis'.split(' ');

const deFirstNames = 'Stefan Klaus Mica Thomas Andreas Jurgen Frank'.split(' ');
const deLastNames = 'Muller Schmidt Weber Schneider Fischer Meyer'.split(' ');

const itFirstNames = 'Leo Hugo Luca Marco Antonio Giovanni Francesco Alessandro'.split(' ');
const itLastNames = 'Rossi Ferrari Ricci Romano Bianchi Gallo Conti'.split(' ');

const frFirstNames = 'Jean Pierre Michel André Louis Philippe Nicolas'.split(' ');
const frLastNames = 'Martin Bernard Dubois Petit Moreau Laurent'.split(' ');

const jpFirstNames = 'Hiroshi Takeshi'.split(' ');
const jpLastNames = 'Sato Suzuki'.split(' ');

export function makePlayerNames() {
  const allNames = [
    ...generatePlayerNames(ptEsFirstNames, ptEsLastNames),
    ...generatePlayerNames(enFirstNames, enLastNames),
    ...generatePlayerNames(deFirstNames, deLastNames),
    ...generatePlayerNames(itFirstNames, itLastNames),
    ...generatePlayerNames(frFirstNames, frLastNames),
    ...generatePlayerNames(jpFirstNames, jpLastNames),
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

const names = makePlayerNames()
console.log(names.length)
console.log(JSON.stringify(names))
