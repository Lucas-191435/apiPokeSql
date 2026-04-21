import { sinnoh } from './../../utils/pokedexs/sinnoh';
import { Request, Response } from "express";
import PokemonService from "./myPokemon.service";

class PokemonMoveController {
    private pokemonService: PokemonService;
    constructor() {
        this.pokemonService = new PokemonService();
    }

    async getAllPokemonOfUser({id}: {id: string}){
        const pokemons = await this.pokemonService.getAllPokemonsOfUser({
            userId: id
        });
        return pokemons;
    }

    async capturePokemon({userId, pokemonId, nickname}: {userId: string, pokemonId: string, nickname: string}){
        const pokemon = await this.pokemonService.capturePokemon({
            userId,
            pokemonId,
            nickname
        });
        return pokemon;
    }
}

export default PokemonMoveController;