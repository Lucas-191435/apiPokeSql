
export type MyteamOfPokemon = {
    pokemonId: string,
    teamAlpha: boolean,
    teamBeta: boolean,
    teamGamma: boolean,
}

export type DTOUpdatePokemonTeam = {
    userId: string, teamName: "teamAlpha" | "teamBeta" | "teamGamma", team: string[]
}

export type MyPokemonMove = {
    myPokemonId: string,
    team: "teamAlpha" | "teamBeta" | "teamGamma",
    moves: string[]
}

export type DTOUpdatePokemonMoves = {
    userId: string, data: MyPokemonMove
}