import { Pokemon, Region } from "@prisma/client";
import { IPokemon } from "../modules/pokemon/pokeApi.service";

export const transformPokemonData = (pokemon: Pokemon ): IPokemon  => {
    return {
        id: pokemon.id,
        number: pokemon.pokeId,
        name: pokemon.name,
        types: JSON.parse(pokemon.types || "[]"),
        abilities: JSON.parse(pokemon.abilities || "[]"),
        region: pokemon.region as Region,
        height: pokemon.height,
        weight: pokemon.weight,
        img1: pokemon.img1 || "",
        img2: pokemon.img2 || "",
        img3: pokemon.img3 || "",
    }
}