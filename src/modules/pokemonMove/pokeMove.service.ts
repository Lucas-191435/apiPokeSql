import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";
import { transformPokemonData } from "../../utils/utils";


type PokemonMoveInsert = {
    pokemonId: string;
    moveId: string;
    learn_method: 'LEVEL_UP' | 'TUTOR' | 'MACHINE' | 'EGG' | 'UNKNOWN';
    level: number;
};

class PokeMoveService {
    // Busca todos os pokémons do banco
    getAllPokemonsFromDB = async () => {
        try {
            const pokemons = await prismaClient.pokemon.findMany({
                select: {
                    id: true,
                    pokeId: true,
                    name: true
                },
                orderBy: {
                    pokeId: 'asc'
                }
            });
            return pokemons;
        } catch (error) {
            console.error("Error fetching pokemons from database:", error);
            throw error;
        }
    }

    // Busca um movimento do banco pelo nome
    getMoveByName = async (moveName: string) => {
        try {
            const move = await prismaClient.move.findFirst({
                where: {
                    name: moveName
                },
                select: {
                    id: true,
                    name: true
                }
            });
            return move;
        } catch (error) {
            console.error(`Error fetching move ${moveName} from database:`, error);
            throw error;
        }
    }

    // Processar em lotes menores para evitar problemas com muitos dados
    createManyPokeMoves = async (moves: PokemonMoveInsert[]) => {
        try {
            console.log("Creating pokemon-move relationships:", moves.length, "relationships");

            const batchSize = 100; // Lotes maiores para relações
            let totalCreated = 0;

            for (let i = 0; i < moves.length; i += batchSize) {
                const batch = moves.slice(i, i + batchSize);
                console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(moves.length / batchSize)} (${batch.length} relationships)`);

                try {
                    const createdPokeMoves = await prismaClient.pokemonMove.createMany({
                        data: batch,
                        skipDuplicates: true, // Evita erro se relação já existir
                    });

                    totalCreated += createdPokeMoves.count;
                    console.log(`Batch completed. Created ${createdPokeMoves.count} relationships.`);

                } catch (batchError) {
                    console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, batchError);
                    // Continua com o próximo lote mesmo se um falhar
                }
            }

            console.log(`Successfully created ${totalCreated} pokemon-move relationships in total`);

        } catch (error) {
            console.error("Error creating pokemon-move relationships:", error);
            throw error;
        }
    }

    getPokemonMove = async (id: string) => {
        try {
            console.log("Fetched pokemon:", id);

            const pokemon = await prismaClient.pokemon.findFirst({
                where: {
                    pokeId: parseInt(id)
                },
            })
            console.log("Fetched pokemon:", pokemon);
            const pokeMoves = await prismaClient.pokemonMove.findMany({
                where: {
                    pokemonId: pokemon?.id
                },
                include: {
                    move: true
                }
            });

            const moves = pokeMoves.map(move => {
                return {
                    learn_method: move.learn_method,
                    level: move.level,
                    ...move.move
                }
            });

            return { name: pokemon?.name, moves };
        } catch (error) {
            console.error("Error fetching pokemons from database:", error);
            throw error;
        }
    }
}

export default PokeMoveService;