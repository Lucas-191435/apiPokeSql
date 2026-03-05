import { AppPokemonService } from "../../interfaces/IPokemon";
import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";
import { transformPokemonData } from "../../utils/utils";

const createError = (message: string, status: number) => {
    const error = new Error(message);
    (error as any).statusCode = status;
    return error;
};

class PokemonService implements AppPokemonService.IPokemonService {
    getPokemons: AppPokemonService.GetPokemons.Handler = async ({ page, pageSize, query, types, weight }) => {
        try {
            console.log("Fetching pokemons with query:", query, "page:", page, "pageSize:", pageSize);
            const conditions: Array<Record<string, any>> = [];
            if (query) {
                conditions.push({
                    OR: [
                        {
                            name: {
                                contains: `${query}`,
                            }
                        },
                    ],
                });
            }

            if (types && types.length > 0) {
                conditions.push({
                    OR: types.map((type) => ({
                        types: {
                            contains: type,
                        },
                    })),
                });
            }

            if (weight) {
                if (weight === 'small') {
                    conditions.push({
                        weight: {
                            gte: 0,
                            lte: 300,
                        }
                    });
                } else if (weight === 'medium') {
                    conditions.push({
                        weight: {
                            gte: 300,
                            lte: 850,
                        }
                    });
                } else if (weight === 'large') {
                    conditions.push({
                        weight: {
                            gte: 850,
                            // lte: 900,
                        }
                    });
                }
            }

            console.log("Conditions for query:", JSON.stringify(conditions, null, 2))

            const where: Prisma.PokemonFindManyArgs["where"] = {
                AND: conditions.length > 0 ? conditions : undefined,
            };

            const pokes = await prismaClient.pokemon.findMany({
                orderBy: {
                    pokeId: 'asc',
                },
                where,
                skip: ((page ?? 1) - 1) * (pageSize ?? 20),
                take: pageSize ?? 20,
            });

            const pokesCount = await prismaClient.pokemon.count({ where });

            const pokedex = pokes.map((pokemon) => {
                return transformPokemonData(pokemon);
            });

            return {
                count: pokesCount,
                pokemon: pokedex
            }
        } catch (error) {
            console.error("Error fetching pokemons:", error);
            throw error
        }
    }

    getPokemon: AppPokemonService.GetPokemon.Handler = async (Id) => {
        try {
            const value = Id;

            const isNumeric = !isNaN(Number(value));
            const pokeId = isNumeric ? Number(value) : undefined;
            const id = !isNumeric ? value : undefined;

            const conditions: Array<Record<string, any>> = [];
            if (id) conditions.push({ id });
            if (pokeId !== undefined) conditions.push({ pokeId });

            const pokemon = await prismaClient.pokemon.findFirst({
                where: {
                    OR: conditions,
                },
            });

            if (!pokemon) {
                throw createError("Pokémon não encontrado", 404);
            }

            const pk = transformPokemonData(pokemon);
            return pk

        } catch (error) {
            console.error("Error fetching pokemons:", error);
            throw error;
        }
    };


    insertPokemonInDataBase: AppPokemonService.InsertPokemonInDataBase.Handler = async ({ pokedex }) => {
        try {
            const transformedPokedex = pokedex.map((pokemon) => {
                return {
                    pokeId: pokemon.number,
                    name: pokemon.name,
                    types: JSON.stringify(pokemon.types),
                    abilities: JSON.stringify(pokemon.abilities),
                    region: pokemon.region as Region,
                    height: pokemon.height,
                    weight: pokemon.weight,
                    img1: pokemon.img1 || null,
                    img2: pokemon.img2 || null,
                    img3: pokemon.img3 || null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
            });
            const insert = await prismaClient.pokemon.createMany({
                data: transformedPokedex,
            });


            return pokedex
        } catch (error) {
            throw error
        }
    }
}

export default PokemonService;