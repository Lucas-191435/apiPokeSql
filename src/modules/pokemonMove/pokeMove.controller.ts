import { sinnoh } from './../../utils/pokedexs/sinnoh';
import { Request, Response } from "express";
import PokemonService from "./pokeMove.service";

class PokemonMoveController {
    private pokemonService: PokemonService;
    constructor() {
        this.pokemonService = new PokemonService();
    }

    async getPokemonMove({id}: {id: string}){
            const pokeMove = await this.pokemonService.getPokemonMove(id);

            return pokeMove
    }
}

export default PokemonMoveController;