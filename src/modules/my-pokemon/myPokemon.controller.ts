import { sinnoh } from './../../utils/pokedexs/sinnoh';
import { Request, Response } from "express";
import MyPokemonService from "./myPokemon.service";
import { DTOUpdatePokemonMoves, DTOUpdatePokemonTeam } from './types/IMyPokemonService';

class PokemonMoveController {
    private myPokemonService: MyPokemonService;
    constructor() {
        this.myPokemonService = new MyPokemonService();
    }

    async getAllPokemonOfUser({ id }: { id: string }) {
        const pokemons = await this.myPokemonService.getAllPokemonsOfUser({
            userId: id
        });
        return pokemons;
    }

    async capturePokemon({ userId, pokemonId, nickname }: { userId: string, pokemonId: string, nickname: string }) {
        const pokemon = await this.myPokemonService.capturePokemon({
            userId,
            pokemonId,
            nickname
        });
        return pokemon;
    }

    async leavePokemon({ userId, pokemonId }: { userId: string, pokemonId: string }) {
        const result = await this.myPokemonService.leavePokemon({
            userId,
            pokemonId
        });
        return result;
    }

    async updatePokemonTeam(data: DTOUpdatePokemonTeam) {
        const result = await this.myPokemonService.updatePokemonTeam({
            ...data 
        });
        return result;
    }

    async updatePokemonMoves(data: DTOUpdatePokemonMoves) {
        const result = await this.myPokemonService.updatePokemonMoves({
            ...data 
        });
        return result;
    }
}

export default PokemonMoveController;