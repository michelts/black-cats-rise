export function generatePlayerNames(tc: number, ppt: number): string[][] {
    const f = 'João José António Carlos Pedro Lucas Luís Marcos Gabriel Rafael Daniel Marcelo Bruno Felipe Ricardo Rodrigo André Juan Marco Leo Hugo Martin Mateo Pablo Alex Mario David Diego Javier John Paul Mark Michael Peter Stefan Klaus Luca'.split(' ');
    const l = 'Silva Santos Costa Pereira Oliveira Almeida Ferreira Alves Gomes Rodrigues Martins Sousa Castro Dias Fernandes Nunes Lopes Marques Mendes Pinto Cardoso Teixeira Smith Jones Muller Schmidt Rossi Ferrari Baker Hill Weber Ricci'.split(' ');

    const total = tc * ppt;
    const names: string[] = [];

    for (const first of f) {
        for (const last of l) {
            names.push(`${first} ${last}`);
        }
    }

    if (total > names.length) {
        throw new Error(`Cannot generate ${total} unique names. Maximum available is ${names.length}.`);
    }

    // Fisher-Yates shuffle
    for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]];
    }

    const teams: string[][] = [];
    let idx = 0;

    for (let i = 0; i < tc; i++) {
        teams.push(names.slice(idx, idx + ppt));
        idx += ppt;
    }

    return teams;
}
