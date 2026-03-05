import { PokeAPIService } from "../../interfaces/IPokeAPI";
import { PokeAPIClient } from "../../services/pokeApiService";
import IPokemonSpecies from "../../types/pokeAPi/IPokemonSpecies";

export type IPokemon = {
    number: number;
    name: string;
    types: string[];
    abilities: string[];
    region: string;
    height: number;
    weight: number;
    img1: string;
    img2: string;
    img3: string;
}

const gerRigion = (number: number) => {
    if (number >= 1 && number <= 151) {
        return "KANTO"
    } else if (number >= 152 && number <= 251) {
        return "JOHTO"
    } else if (number >= 252 && number <= 386) {
        return "HOENN"
    } else if (number >= 387 && number <= 493) {
        return "SINNOH"
    } else if (number >= 494 && number <= 649) {
        return "UNOVA"
    }
    return "KANTO";
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
                const dados: IPokemonPokeAPi = await PokeAPIClient.get(`pokemon/${pokemon.name}`);
                return {
                    number: dados.data.id,
                    name: dados.data.name,
                    types: dados.data.types.map((type) => type.type.name),
                    abilities: dados.data.abilities.map((ability) => ability.ability.name),
                    region: gerRigion(dados.data.id),
                    height: dados.data.height,
                    weight: dados.data.weight,
                    img1: dados.data.sprites.versions["generation-v"]?.["black-white"]?.animated?.front_default ?? "",
                    img2: dados.data.sprites.versions["generation-v"]?.["black-white"]?.front_default ?? "",
                    img3: dados.data.sprites.other["official-artwork"]?.["front_default"] ?? "",
                };
            });

            const pokemonData = await Promise.all(pokemon);

            return pokemonData;
        } catch (error) {
            throw error;
        }
    };

    pokemonDescription: PokeAPIService.GetPokemonDescription.Handler = async (id) => {
        const pokemonRes: {
            status: number,
            statusText: string,
            data: IPokemonSpecies
        } = await PokeAPIClient.get(`pokemon-species/${id}`);

        const descriptions = pokemonRes.data.flavor_text_entries.filter((e) =>e.language.name === 'en').map((e) => {
            return {
                version: e.version.name,
                description: e.flavor_text
            }
        });

        return descriptions
    }
}

export default PokeAPI;