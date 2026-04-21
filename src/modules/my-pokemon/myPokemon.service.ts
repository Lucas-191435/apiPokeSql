import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";
import { transformPokemonData } from "../../utils/utils";


const createError = (message: string, status: number) => {
    const error = new Error(message);
    (error as any).statusCode = status;
    return error;
};

class MyPokemonService {
    getAllPokemonsOfUser = async ({ userId }: { userId: string }) => {
        try {
            const pokemons = await prismaClient.myPokemon.findMany({
                where: {
                    userId
                },
                select: {
                    id: true,
                    nickname: true,
                    pokemon: {
                        select: {
                            id: true,
                            name: true,
                            img1: true,
                            types: true,
                        }
                    }
                }
            });

            return pokemons;
        } catch (error) {
            console.error("Error fetching pokemons from database:", error);
            throw error;
        }
    }

    capturePokemon = async ({ 
        userId, pokemonId, nickname 
    }: { 
        userId: string,
        pokemonId: string,
        nickname: string,
    }) => {
        try {
            if (!pokemonId) {
                throw createError("Pokemon ID is required", 400);
            }

            const existingPokemon = await prismaClient.myPokemon.findFirst({
                where: {
                    userId,
                    pokemonId
                }
            });

            if (existingPokemon) {
                console.log(existingPokemon);
                throw createError("Pokemon já capturado pelo usuário", 400);
            }

            const countAllCapturedPokemons = await prismaClient.myPokemon.count({
                where: {
                    userId
                }
            });

            if (countAllCapturedPokemons >= 20) {
                 throw createError("User cannot capture more than 20 pokemons", 404);
            }


            const pokemons = await prismaClient.myPokemon.create({
                data: {
                    pokemonId,
                    userId,
                    nickname: nickname || null,
                },
            });

            return pokemons;
        } catch (error) {
            console.error("Error fetching pokemons from database:", error);
            throw error;
        }
    }

}

export default MyPokemonService;