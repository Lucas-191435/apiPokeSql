import { PokeAPIService } from "../../interfaces/IPokeAPI";
import { PokeAPIClient } from "../../services/pokeApiService";
import IPokemonSpecies from "../../types/pokeAPi/IPokemonSpecies";
import { IGetPokemonPokeAPi } from "../../types/pokeAPi/IGetPokemon";
import { IPokemonPokeAPi } from "../../types/pokeAPi/IPokemonPokeAPI";
import logger from "../../utils/logger";

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

const getRigion = (number: number) => {
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

const sprite = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
const spriteDefault = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
const spriteShiny = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
const spriteBack = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`;


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
                    region: getRigion(dados.data.id),
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

        const descriptions = pokemonRes.data.flavor_text_entries.filter((e) => e.language.name === 'en').map((e) => {
            return {
                version: e.version.name,
                description: e.flavor_text
            }
        });

        return descriptions
    }

    pokemonInfos: PokeAPIService.GetPokemonInfos.Handler = async (id) => {
        logger.info(`Fetching infos for Pokemon ID: ${id}`);
        const [pokemon, pokemonSpecies]: [
            {
                status: number,
                statusText: string,
                data: {
                    stats: {
                        base_stat: number,
                        stat: {
                            name: string;
                        }
                    }[]
                }
            },
            {
                status: number,
                statusText: string,
                data: IPokemonSpecies
            }
        ] = await Promise.all([
            PokeAPIClient.get(`pokemon/${id}`),
            PokeAPIClient.get(`pokemon-species/${id}`)
        ]);
        let infos: {
            descriptions: {
                version: string,
                description: string;
            }[],
            evolutionChain: { name: string, id: number, level: number | null }[]
            sprites: {
                label: string,
                url: string,
            }[],
            regions: string[],
            stats: {
                name: string,
                value: number
            }[]
        } = {
            descriptions: [],
            evolutionChain: [],
            sprites: [],
            regions: [],
            stats: []
        }

        const descriptions = pokemonSpecies.data.flavor_text_entries.filter((e) => e.language.name === 'en').map((e) => {
            infos.regions.push(e.version.name);
            return {
                version: e.version.name,
                description: e.flavor_text
            }
        });

        infos['descriptions'] = descriptions;


        const evolutionChainId = pokemonSpecies.data.evolution_chain.url.replace("https://pokeapi.co/api/v2/evolution-chain/", "").replace("/", "");
        const evolutionChain = await PokeAPIClient.get(`evolution-chain/${evolutionChainId}`);



        const extractEvolutionChain = (chain: any, evolutions: { name: string, id: number, level: number | null }[] = []) => {
            const pokemonId = parseInt(chain.species.url.replace("https://pokeapi.co/api/v2/pokemon-species/", "").replace("/", ""));
            const pokename = chain.species.name;
            const level = chain.evolution_details[0]?.min_level || null;
            evolutions.push({ name: pokename, id: pokemonId, level });
            if (chain.evolves_to.length > 0) {
                chain.evolves_to.forEach((evolution: any) => {
                    extractEvolutionChain(evolution, evolutions);
                });
            }
        }

        const evolutions: { name: string, id: number, level: number | null }[] = [];
        extractEvolutionChain(evolutionChain.data.chain, evolutions);
        infos['evolutionChain'] = evolutions;


        infos['sprites'] = [
            {
                label: "official",
                url: sprite(parseInt(id))
            },
            {
                label: "default",
                url: spriteDefault(parseInt(id))
            },
            {
                label: "shiny",
                url: spriteShiny(parseInt(id))
            },
            {
                label: "back",
                url: spriteBack(parseInt(id))
            }
        ];

        const stats = pokemon.data.stats.map((stat) => {
            return {
                name: stat.stat.name,
                value: stat.base_stat
            }
        });
        infos['stats'] = stats;

        // console.log(infos)


        return infos
    }
}

export default PokeAPI;