import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";
import { transformPokemonData } from "../../utils/utils";

import { AppMovesService } from "./types/IMovesService";



class MoveService  {

    // Processar em lotes menores para evitar problemas com muitos dados
    createManyMoves = async (moves: Array<any>) => {
        try {
            console.log("Creating moves:", moves.length, "moves");
            
            const batchSize = 50;
            let totalCreated = 0;
            
            for (let i = 0; i < moves.length; i += batchSize) {
                const batch = moves.slice(i, i + batchSize);
                console.log(`Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(moves.length/batchSize)} (${batch.length} moves)`);
                
                try {
                    const createdMoves = await prismaClient.move.createMany({
                        data: batch,
                        skipDuplicates: true, // Evita erro se move já existir
                    });
                    
                    totalCreated += createdMoves.count;
                    console.log(`Batch completed. Created ${createdMoves.count} moves.`);
                    
                } catch (batchError) {
                    console.error(`Error inserting batch ${Math.floor(i/batchSize) + 1}:`, batchError);
                    // Continua com o próximo lote mesmo se um falhar
                }
            }
            
            console.log(`Successfully created ${totalCreated} moves in total`);
            
        } catch (error) {
            console.error("Error creating moves:", error);
            throw error;
        }
    }
}

export default MoveService;