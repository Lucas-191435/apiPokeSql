import { PokeAPIClient } from "../../services/pokeApiService";
import { Move } from "./types/IMove";

class IMovesPokeAPI {
    // Delay entre requests para evitar rate limiting
    private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    getItems = async () => {
        try {
            const getItems: {
                data: {
                    count: number;
                    next: string | null;
                    previous: string | null;
                    results: Array<{
                        name: string;
                        url: string;
                    }>;
                }
            } = await PokeAPIClient.get(`move`, {
                params: {
                    limit: 10,
                    offset: 0,
                },
            });
            return getItems.data;
        } catch (error) {
            console.error("Error fetching items from PokeAPI:", error);
            throw error;
        }
    }

    // Busca todos os moves com paginação
    getAllMoves = async () => {
        try {
            console.log("Fetching all moves from PokeAPI...");
            const allMoves: Array<{ name: string; url: string }> = [];
            let url = "move?limit=100&offset=0";

            while (url) {
                console.log(`Fetching: ${url}`);
                
                const response: {
                    data: {
                        count: number;
                        next: string | null;
                        previous: string | null;
                        results: Array<{ name: string; url: string }>;
                    }
                } = await PokeAPIClient.get(url);

                allMoves.push(...response.data.results);
                url = response.data.next ? response.data.next.replace('https://pokeapi.co/api/v2/', '') : '';
                
                console.log(`Fetched ${response.data.results.length} moves. Total: ${allMoves.length}/${response.data.count}`);
                
                // Delay para evitar rate limiting
                if (url) {
                    await this.delay(500);
                }
            }

            console.log(`Successfully fetched all ${allMoves.length} moves`);
            return allMoves;
        } catch (error) {
            console.error("Error fetching all moves from PokeAPI:", error);
            throw error;
        }
    }

    // Busca múltiples moves em lote com rate limiting
    getMovesInBatches = async (moveReferences: Array<{ name: string; url: string }>) => {
        const moves: Move[] = [];
        const batchSize = 10; // Processar 10 moves por vez
        
        for (let i = 0; i < moveReferences.length; i += batchSize) {
            const batch = moveReferences.slice(i, i + batchSize);
            console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(moveReferences.length/batchSize)} (moves ${i + 1}-${Math.min(i + batchSize, moveReferences.length)})`);
            
            const batchPromises = batch.map(async (moveRef) => {
                try {
                    // Extrair ID da URL
                    const id = moveRef.url.split('/').filter(Boolean).pop();
                    if (!id) throw new Error(`Invalid URL: ${moveRef.url}`);
                    
                    const move = await this.findMove(parseInt(id));
                    return move;
                } catch (error) {
                    console.error(`Error fetching move ${moveRef.name}:`, error);
                    return null;
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            const validMoves = batchResults.filter(move => move !== null) as Move[];
            moves.push(...validMoves);
            
            // Delay entre batches para evitar rate limiting
            if (i + batchSize < moveReferences.length) {
                console.log("Waiting 2 seconds before next batch...");
                await this.delay(2000);
            }
        }
        
        return moves;
    }

    findMove = async (id: number) => {
        try {
            const move: {
                data: Move;
            } = await PokeAPIClient.get(`move/${id}`);
            return move.data;
        } catch (error) {
            console.error("Error fetching move from PokeAPI:", error);
            throw error;
        }
    }
}

export default IMovesPokeAPI;