import PokemonService from "../modules/pokemon/pokemon.service";
import { PokeAPIClient } from "../services/pokeApiService";

// npx ts-node insert-pokestats-in-db.ts


type StatsFromAPI = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  }
};

type PokemonStatsFromAPI = {
  id: number;
  name: string;
  stats: StatsFromAPI[];
};


// Delay para evitar rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Busca estatísticas de um pokémon específico na PokeAPI
const fetchPokemonStats = async (pokeId: number): Promise<StatsFromAPI[]> => {
  try {
    const response: { data: PokemonStatsFromAPI } = await PokeAPIClient.get(`pokemon/${pokeId}`);
    return response.data.stats;
  } catch (error) {
    console.error(`Error fetching stats for pokemon ${pokeId}:`, error);
    return [];
  }
};

// Processa os movimentos de um pokémon e retorna dados para inserir no banco
const processPokemonStats = async (pokemon: { id: string; pokeId: number; name: string }, pokemonService: PokemonService) => {
  try {
    console.log(`Processing stats for ${pokemon.name} (ID: ${pokemon.pokeId})`);
    
    const apiStats = await fetchPokemonStats(pokemon.pokeId);
    
      // Inserir as estatísticas do pokemon no banco de dados
      await pokemonService.insertPokemonStatsInDataBase({
        pokemonId: pokemon.pokeId,
        stats: {
          hp: apiStats.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
          atk: apiStats.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
          def: apiStats.find(stat => stat.stat.name === 'defense')?.base_stat || 0,
          spAtk: apiStats.find(stat => stat.stat.name === 'special-attack')?.base_stat || 0,
          spDef: apiStats.find(stat => stat.stat.name === 'special-defense')?.base_stat || 0,
          speed: apiStats.find(stat => stat.stat.name === 'speed')?.base_stat || 0,
        }
      });
      

    
  } catch (error) {
    console.error(`Error processing moves for pokemon ${pokemon.name}:`, error);
    throw error;
  }
};

const runScript = async () => {
  const pokeMoveService = new PokemonService();
  
  console.log("🎯 Starting pokemon-stats relationships insertion script...");
  console.log("📋 This process will:");
  console.log("   1. Fetch all pokemons from database");
  console.log("   2. For each pokemon, fetch stats from PokeAPI");
  console.log("   3. Process stats details");
  console.log("   4. Insert pokemon-stats relationships into database");
  console.log("⏱️  Estimated time: depends on pokemon count\n");
  
  const startTime = Date.now();
  
  try {
    // 1. Buscar todos os pokémons do banco
    console.log("📡 Step 1: Fetching pokemons from database...");
    const pokemons = await pokeMoveService.getAllPokemonsFromDB();
    console.log(`✅ Found ${pokemons.length} pokemons in database\n`);
    
    if (pokemons.length === 0) {
      console.log("⚠️  No pokemons found in database. Please run pokemon insertion first.");
      return;
    }
    
    // 2. Processar pokémons em lotes com rate limiting
    console.log("🔍 Step 2: Processing pokemon stats...");
    const batchSize = 5; // Processar 5 pokémons por vez
    
    for (let i = 0; i < pokemons.length; i += batchSize) {
      const batch = pokemons.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(pokemons.length/batchSize)} (pokemons ${i + 1}-${Math.min(i + batchSize, pokemons.length)})`);
      
      const batchPromises = batch.map(pokemon => 
        processPokemonStats(pokemon, pokeMoveService)
      );
      
      const batchResults = await Promise.all(batchPromises);
      const flatResults = batchResults.flat();
      
      console.log(`Batch completed. Found ${flatResults.length} relationships.`);
      
      // Rate limiting entre batches
      if (i + batchSize < pokemons.length) {
        console.log("Waiting 3 seconds before next batch...");
        await delay(3000);
      }
    }
    
    console.log(`\n✅ Processed all pokemons. Found ${pokemons.length} total relationships\n`);
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log("\n🎉 =================================");
    console.log("✅ Script completed successfully!");
    console.log(`⏱️  Total time: ${duration} seconds`);
    console.log(`📊 Processed: ${pokemons.length} pokemons`);
    console.log("=================================\n");
    
  } catch (error) {
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log("\n❌ =================================");
    console.error("💥 Script failed after", duration, "seconds");
    console.error("Error:", error);
    console.log("=================================\n");
    process.exit(1);
  }
};

runScript();