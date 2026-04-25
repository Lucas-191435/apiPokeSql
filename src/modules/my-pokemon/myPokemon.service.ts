import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";
import { transformPokemonData } from "../../utils/utils";
import { DTOUpdatePokemonMoves, DTOUpdatePokemonTeam } from "./types/IMyPokemonService";
import { validate as validateUUID } from 'uuid';

const createError = (message: string, status: number) => {
    const error = new Error(message);
    (error as any).statusCode = status;
    return error;
};

const validateUUIDArray = (moves: string[]): { isValid: boolean; invalidMoves: string[] } => {
    const invalidMoves = moves.filter(move => !validateUUID(move));
    return {
        isValid: invalidMoves.length === 0,
        invalidMoves
    };
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
                throw createError("Usuário não pode capturar mais de 20 pokemons", 404);
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
            console.error("Erro ao capturar pokemon:", error);
            throw error;
        }
    }

    leavePokemon = async ({ userId, pokemonId }: { userId: string, pokemonId: string }) => {
        try {
            const result = await prismaClient.myPokemon.deleteMany({
                where: {
                    userId,
                    pokemonId
                }
            });
            return {
                message: "Pokemon liberado com sucesso"
            };
        } catch (error) {
            console.error("Erro ao liberar pokemon:", error);
            throw error;
        }
    }

    updatePokemonTeam = async ({ userId, data }: DTOUpdatePokemonTeam) => {
        try {
            const updatePromises = data.map(({ pokemonId, teamAlpha, teamBeta, teamGamma }) => {
                return prismaClient.myPokemon.updateMany({
                    where: {
                        userId,
                        pokemonId
                    },
                    data: {
                        teamAlpha,
                        teamBeta,
                        teamGamma
                    }
                });
            });
            await Promise.all(updatePromises);
            return {
                message: "Team updated successfully"
            };
        } catch (error) {
            console.error("Erro ao atualizar time de pokemons:", error);
            throw error;
        }
    }

    updatePokemonMoves = async ({ userId, data }: DTOUpdatePokemonMoves) => {
        try {
            const { myPokemonId, team, moves } = data;

            const result = await prismaClient.myPokemon.update({
                where: {
                    userId: userId,
                    id: myPokemonId
                },
                data: {
                    [team + "Move"]: moves
                }
            });
            return result;

        } catch (error) {
            console.error("Erro ao atualizar movimentos de pokemons:", error);
            throw error;
        }
    }
}

export default MyPokemonService;