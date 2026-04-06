import MoveService from "../modules/moves/moves.service";
import IMovesPokeAPI from "../modules/moves/movesPokeApi.service";
import { Move } from "../modules/moves/types/IMove";


// npx ts-node insert-moves-in-db.ts

// Transforma os dados da PokeAPI para o formato do banco
const transformMoveData = (move: Move) => {
    // Busca a descrição em inglês
    const englishEffect = move.effect_entries?.find(entry => entry.language?.name === 'en');
    
    return {
        pokeMoveId: move.id,
        name: move.name,
        accuracy: move.accuracy,
        power: move.power,
        pp: move.pp,
        priority: move.priority,
        type: move.type?.name || null,
        description: englishEffect?.short_effect || null,
        target: move.target?.name || null,
        damage_class: move.damage_class?.name || null,
        effect: englishEffect?.effect || null,
        effect_chance: move.effect_chance,
        ailment: move.meta?.ailment?.name || null,
        category: move.meta?.category?.name || null,
        crit_rate: move.meta?.crit_rate || 0,
        drain: move.meta?.drain || 0,
        flinch_chance: move.meta?.flinch_chance || 0,
        healing: move.meta?.healing || 0,
        min_hits: move.meta?.min_hits || null,
        max_hits: move.meta?.max_hits || null,
        min_turns: move.meta?.min_turns || null,
        max_turns: move.meta?.max_turns || null,
        stat_chance: move.meta?.stat_chance || 0,
    };
};

const runScript = async () => {
    const moveService = new MoveService();
    const movesPokeAPI = new IMovesPokeAPI();
    
    console.log("🎯 Starting moves insertion script...");
    console.log("📋 This process will:");
    console.log("   1. Fetch all 937 moves from PokeAPI");
    console.log("   2. Process them in batches with rate limiting");
    console.log("   3. Transform data to database format");
    console.log("   4. Insert them into the database");
    console.log("⏱️  Estimated time: 10-15 minutes\n");
    
    const startTime = Date.now();
    
    try {
        // 1. Buscar todas as referências de moves
        console.log("📡 Step 1: Fetching move references from PokeAPI...");
        const moveReferences = await movesPokeAPI.getAllMoves();
        console.log(`✅ Found ${moveReferences.length} moves to process\n`);
        
        // 2. Buscar detalhes de cada move em lotes
        console.log("🔍 Step 2: Fetching detailed move data...");
        const detailedMoves = await movesPokeAPI.getMovesInBatches(moveReferences);
        console.log(`✅ Successfully fetched details for ${detailedMoves.length} moves\n`);
        
        // 3. Transformar dados para formato do banco
        console.log("🔄 Step 3: Transforming data for database...");
        const transformedMoves = detailedMoves.map(move => transformMoveData(move));
        console.log(`✅ Transformed ${transformedMoves.length} moves\n`);
        
        // 4. Inserir em lotes no banco
        console.log("💾 Step 4: Inserting moves into database...");
        await moveService.createManyMoves(transformedMoves);
        
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        
        console.log("\n🎉 =================================");
        console.log("✅ Script completed successfully!");
        console.log(`⏱️  Total time: ${duration} seconds`);
        console.log(`📊 Processed: ${transformedMoves.length} moves`);
        console.log("=================================");
        
    } catch (error) {
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        
        console.log("\n❌ =================================");
        console.error("💥 Script failed after", duration, "seconds");
        console.error("Error:", error);
        console.log("=================================");
        process.exit(1);
    }
};

runScript();