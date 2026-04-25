
export type MyteamOfPokemon = {
    pokemonId: string,
    teamAlpha: boolean,
    teamBeta: boolean,
    teamGamma: boolean,
}

export type DTOUpdatePokemonTeam = {
    userId: string, data: MyteamOfPokemon[]
}

export type MyPokemonMove = {
    myPokemonId: string,
    team: "teamAlpha" | "teamBeta" | "teamGamma",
    moves: string[]
}

export type DTOUpdatePokemonMoves = {
    userId: string, data: MyPokemonMove
}