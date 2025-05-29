import { AppPokemonService } from "../../interfaces/IPokemon";
import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";
import { transformPokemonData } from "../../utils/utils";

class PokemonService implements AppPokemonService.IPokemonService {
    getPokemons: AppPokemonService.GetPokemons.Handler = async ({ page, pageSize, query }) => {
        try {
            const conditions: Array<Record<string, any>> = [];
            if (query) {
                conditions.push({
                    OR: [
                        {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        },
                    ],
                });
            }

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
            const pokesCount = await prismaClient.pokemon.count({
                where: {
                    ...(query && {
                        OR: [
                            { name: { contains: query } },
                        ],
                    }),
                },
            });

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


    insertPokemonInDataBase: AppPokemonService.InsertPokemonInDataBase.Handler = async ({ pokedex }) => {
        try {
            const transformedPokedex = pokedex.map((pokemon) => {
                return {
                    pokeId: pokemon.number,
                    name: pokemon.name,
                    types: JSON.stringify(pokemon.types), // ou pokemon.types.join(',') se preferir
                    abilities: JSON.stringify(pokemon.abilities),
                    region: pokemon.region as Region, // certifique-se que seja um valor válido
                    height: pokemon.height,
                    weight: pokemon.weight,
                    img1: pokemon.img1 || null,
                    img2: pokemon.img2 || null,
                    img3: pokemon.img3 || null,
                    createdAt: new Date(), // opcional, pois o schema já usa default(now())
                    updatedAt: new Date(), // opcional, pois o schema já usa @updatedAt
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