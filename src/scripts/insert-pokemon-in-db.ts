import PokeAPIService from "../modules/pokemon/pokeApi.service";
import PokemonService from "../modules/pokemon/pokemon.service";

// npx ts-node src/scripts/insert-pokemon-in-db.ts

const runScript = async () => {
    const pokeAPIService = new PokeAPIService();
    const pokemonService = new PokemonService();

    try {
        console.log("Buscando Pokémons na PokeAPI...");

        const kanto = await pokeAPIService.getPokemons({ offset: 0, limit: 151, final: 2 });
        const johto = await pokeAPIService.getPokemons({ offset: 151, limit: 100, final: 2 });
        const hoenn = await pokeAPIService.getPokemons({ offset: 251, limit: 135, final: 2 });
        const sinnoh = await pokeAPIService.getPokemons({ offset: 386, limit: 108, final: 2 });
        const unova = await pokeAPIService.getPokemons({ offset: 494, limit: 155, final: 2 });

        if ('message' in kanto) throw new Error(`Kanto: ${kanto.message}`);
        if ('message' in johto) throw new Error(`Johto: ${johto.message}`);
        if ('message' in hoenn) throw new Error(`Hoenn: ${hoenn.message}`);
        if ('message' in sinnoh) throw new Error(`Sinnoh: ${sinnoh.message}`);
        if ('message' in unova) throw new Error(`Unova: ${unova.message}`);

        console.log("Inserindo Kanto...");
        await pokemonService.insertPokemonInDataBase({ pokedex: kanto });

        console.log("Inserindo Johto...");
        await pokemonService.insertPokemonInDataBase({ pokedex: johto });

        console.log("Inserindo Hoenn...");
        await pokemonService.insertPokemonInDataBase({ pokedex: hoenn });

        console.log("Inserindo Sinnoh...");
        await pokemonService.insertPokemonInDataBase({ pokedex: sinnoh });

        console.log("Inserindo Unova...");
        await pokemonService.insertPokemonInDataBase({ pokedex: unova });

        console.log("Todos os Pokémons inseridos com sucesso!");
    } catch (error) {
        console.error("Erro ao inserir Pokémons:", error);
        process.exit(1);
    }
};

runScript();
