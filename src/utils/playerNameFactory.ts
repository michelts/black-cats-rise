import { shuffle } from "@/utils/shuffle";

const ptFirstNames =
  "João José Antônio Carlos Pedro Lucas Marcos Rafael Juliano Márcio";
const ptLastNames =
  "Silva Santos Costa Pereira Oliveira Rodrigues Martins Sousa";

const esFirstNames =
  "Juan Carlos Javier Diego Miguel Angel Jose David Alejandro";
const esLastNames =
  "Garcia Rodriguez Martinez Hernandez Lopez Gonzalez Perez Sanchez Ramirez Torres";

const enFirstNames =
  "John Paul Mark Michael Peter David Chris Robert James William Jack Jim Aaron Jay";
const enLastNames =
  "Smith Jones Baker Hill Taylor Wilson Brown Davis Cox Day Rey Law Key";

const deFirstNames = "Stefan Klaus Mica Thomas Andreas Jurgen Frank";
const deLastNames = "Muller Schmidt Weber Schneider Fischer Meyer";

const itFirstNames =
  "Leo Hugo Luca Marco Antonio Giovanni Francesco Alessandro";
const itLastNames = "Rossi Ferrari Ricci Romano Bianchi Gallo Conti";

const frFirstNames = "Jean Pierre Michel André Louis Philippe Nicolas";
const frLastNames = "Martin Bernard Dubois Petit Moreau Laurent";

const jpFirstNames = "Hiroshi Takeshi";
const jpLastNames = "Sato Suzuki";

const afFirstNames = "Femi Ade Kwame Kofi Jide Emeka Chinedu Olu Yaw Kwaku";
const afLastNames =
  "Adebayo Okafor Nkrumah Mensah Diallo Sow Traoré Keita Bankole Eze";

export function playerNameFactory(): () => string {
  const allNames = [
    ...generatePlayerNames(ptFirstNames, ptLastNames),
    ...generatePlayerNames(esFirstNames, esLastNames),
    ...generatePlayerNames(enFirstNames, enLastNames),
    ...generatePlayerNames(deFirstNames, deLastNames),
    ...generatePlayerNames(itFirstNames, itLastNames),
    ...generatePlayerNames(frFirstNames, frLastNames),
    ...generatePlayerNames(jpFirstNames, jpLastNames),
    ...generatePlayerNames(afFirstNames, afLastNames),
  ];
  shuffle(allNames);
  return () => allNames.pop() || ""; // TODO invariant or handle error
}

export function* generatePlayerNames(
  firstNamesStr: string,
  lastNamesStr: string,
) {
  const firstNames = firstNamesStr.split(" ");
  const lastNames = lastNamesStr.split(" ");
  for (const first of firstNames) {
    for (const last of lastNames) {
      yield `${first} ${last}`;
    }
  }
}
