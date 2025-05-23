import { PokeAPIService } from "../../interfaces/IPokeAPI";
import { PokeAPIClient } from "../../services/pokeApiService";

type IPokemon = {
    name: string;
    types: string[];
    abilities: string[];
    region: string;
    height: number;
    weight: number;
    img1: string;
    img2: string;
}
class PokeAPI implements PokeAPIService.IPokeAPIService {
    getPokemons: PokeAPIService.GetPokemon.Handler = async ({ final, limit, offset }) => {
        try {
            const pokemonRes: IGetPokemonPokeAPi = await PokeAPIClient.get(`pokemon`, {
                params: {
                    limit: limit,
                    offset: offset,
                },
            });

            const pokemon: Promise<IPokemon>[] = pokemonRes.data.results.map(async (pokemon) => {
               const dados: IPokemonPokeAPi  = await PokeAPIClient.get(`pokemon/${pokemon.name}`);
                return {
                    name: dados.data.name,
                    types: dados.data.types.map((type) => type.type.name),
                    abilities: dados.data.abilities.map((ability) => ability.ability.name),
                    region: dados.data.location_area_encounters,
                    height: dados.data.height,
                    weight: dados.data.weight,
                    img1: `https://pokeapi.co/media/sprites/pokemon/${dados.data.id}.png`,
                    img2: `https://pokeapi.co/media/sprites/pokemon/shiny/${dados.data.id}.png`,
                };
            });

            const pokemonData = await Promise.all(pokemon);
            
            return {
                message: "Pokemons",
            };
        } catch (error) {
            throw error;
        }
    };
}

export default PokeAPI;