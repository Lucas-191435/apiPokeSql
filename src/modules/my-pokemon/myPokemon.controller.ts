import { sinnoh } from './../../utils/pokedexs/sinnoh';
import { Request, Response } from "express";
import PokemonService from "./myPokemon.service";

class PokemonMoveController {
    private pokemonService: PokemonService;
    constructor() {
        this.pokemonService = new PokemonService();
    }

    async getAllPokemonOfUser({id}: {id: string}){
        
    }

    async capturePokemon({userId, pokemonId}: {userId: string, pokemonId: string}){
        
    }
}

export default PokemonMoveController;