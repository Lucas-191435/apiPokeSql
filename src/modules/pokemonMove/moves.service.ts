import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";
import { transformPokemonData } from "../../utils/utils";

import { AppMovesService } from "./types/IMovesService";



class PokeMoveService {
    // Processar em lotes menores para evitar problemas com muitos dados
    createManyPokeMoves = async (moves: Array<{
        pokemonId: string,
        moveId: string,
        learn_method: 'LEVEL_UP' | 'TUTOR' | 'MACHINE' | 'EGG' | 'UNKNOWN',
        level: number,

    }>) => {
        try {
            const createdPokeMoves = await prismaClient.pokemonMove.createMany({
                        data: moves,
                        skipDuplicates: true, // Evita erro se move já existir
                    });
        } catch (error) {
            console.error("Error creating moves:", error);
            throw error;
        }
    }
}

export default PokeMoveService;