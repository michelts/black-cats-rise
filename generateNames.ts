export function generatePlayerNames(teamCount: number, playersPerTeam: number): string[][] {
    const firstNames = 'João José António Carlos Pedro Lucas Luís Marcos Gabriel Rafael Daniel Marcelo Bruno Felipe Ricardo Rodrigo André Juan Marco Leo Hugo Martin Mateo Pablo Alex Mario David Diego Javier John Paul Mark Michael Peter Stefan Klaus Luca'.split(' ');
    const lastNames = 'Silva Santos Costa Pereira Oliveira Almeida Ferreira Alves Gomes Rodrigues Martins Sousa Castro Dias Fernandes Nunes Lopes Marques Mendes Pinto Cardoso Teixeira Smith Jones Muller Schmidt Rossi Ferrari Baker Hill Weber Ricci'.split(' ');

    const total = teamCount * playersPerTeam;
    const names: string[] = [];

    for (const first of firstNames) {
        for (const last of lastNames) {
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

    for (let i = 0; i < teamCount; i++) {
        teams.push(names.slice(idx, idx + playersPerTeam));
        idx += playersPerTeam;
    }

    return teams;
}
