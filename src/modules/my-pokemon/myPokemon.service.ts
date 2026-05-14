import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";
import { transformPokemonData } from "../../utils/utils";
import { DTOUpdatePokemonMoves, DTOUpdatePokemonTeam } from "./types/IMyPokemonService";
import { validate as validateUUID } from 'uuid';
import logger from "src/utils/logger";

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
                userId,
            },
            include: {
                pokemon: {
                    select: {
                        id: true,
                        pokeId: true,
                        name: true,
                        img1: true,
                        types: true, // Certifique-se de que este campo é necessário
                    },
                },
            },
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
            await prismaClient.myPokemon.deleteMany({
                where: {
                    userId,
                    id: pokemonId
                }
            });

            logger.info(`Remove Pokémon with ID ${pokemonId} in collection of user ${userId}`);
            return {
                message: "Pokemon liberado com sucesso"
            };
        } catch (error) {
            console.error("Erro ao liberar pokemon:", error);
            throw error;
        }
    }

    updatePokemonTeam = async ({ userId, teamName, team }: DTOUpdatePokemonTeam) => {
        try {
            if (!teamName || !Array.isArray(team)) {
                throw createError("Parâmetros inválidos: 'teamName' deve ser uma string e 'team' deve ser um array.", 400);
            }

            const result = await prismaClient.$transaction(async (prisma) => {
                const changePokemon = await prisma.myPokemon.updateMany({
                    where: {
                        userId,
                        [teamName]: true,
                        id: {
                            notIn: team, // Exclui os itens com IDs no array
                        },
                    },
                    data: {
                        [teamName]: false,
                    },
                });

                logger.info(`${changePokemon.count} pokémons removidos do time '${teamName}' para o usuário ${userId}.`);

                const updatePokemon = await prisma.myPokemon.updateMany({
                    where: {
                        userId,
                        [teamName]: false,
                        id: {
                            in: team,
                        },
                    },
                    data: {
                        [teamName]: true,
                    },
                });

                logger.info(`${updatePokemon.count} pokémons adicionados ao time '${teamName}' para o usuário ${userId}.`);

                return {
                    removed: changePokemon.count,
                    added: updatePokemon.count,
                };
            });

            return {
                message: "Team updated successfully",
                details: result,
            };
        } catch (error) {
            console.error("Erro ao atualizar time de pokémons:", error);
            throw error;
        }
    };

    updatePokemonMoves = async ({ userId, data }: DTOUpdatePokemonMoves) => {
        try {
            const { myPokemonId, teamName, moves } = data;

            const result = await prismaClient.myPokemon.update({
                where: {
                    userId: userId,
                    id: myPokemonId
                },
                data: {
                    [teamName + "Move"]: moves
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