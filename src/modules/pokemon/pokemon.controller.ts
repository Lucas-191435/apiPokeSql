import { Request, Response } from "express";
import PokemonService from "./pokemon.service";
import PokeAPIService from "./pokeApi.service";
class PokemonController {
    private pokemonService: PokemonService;
    private pokeAPIService: PokeAPIService;
    constructor() {
        this.pokemonService = new PokemonService();
        this.pokeAPIService = new PokeAPIService();
    }

    async getPokemons(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(200).json({ message: "GetPokemons" });
        } catch (error) {
            return res
                .status(500)
                .json(error);
        }
    }

    async insertPokemonInDataBase(req: Request, res: Response): Promise<Response> {
        try {
            console.log("insertPokemonInDataBase");

            const poke = await this.pokeAPIService.getPokemons({
                offset: 0,
                limit: 5,
                final: 2,
            });

            const lista = await this.pokemonService.insertPokemonInDataBase({
                userId: 'req.user.id',
            });
            return res.status(200).json({ message: "GetPokemons" });
        } catch (error) {
            return res
                .status(500)
                .json(error);
        }
    }
}

export default PokemonController;