
export type MyteamOfPokemon = {
    pokemonId: string,
    teamAlpha: boolean,
    teamBeta: boolean,
    teamGamma: boolean,
}

export type DTOUpdatePokemonTeam = {
    userId: string, data: MyteamOfPokemon[]
}