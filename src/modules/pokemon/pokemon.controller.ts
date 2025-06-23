import { sinnoh } from './../../utils/pokedexs/sinnoh';
import { Request, Response } from "express";
import PokemonService from "./pokemon.service";
import PokeAPIService, { IPokemon } from "./pokeApi.service";
class PokemonController {
    private pokemonService: PokemonService;
    private pokeAPIService: PokeAPIService;
    constructor() {
        this.pokemonService = new PokemonService();
        this.pokeAPIService = new PokeAPIService();
    }

    async getPokemons(req: Request, res: Response): Promise<Response> {
        try {
            const { page, pageSize, query } = req.query;
            console.log("Page:", page, "PageSize:", pageSize);
            const pokedex = await this.pokemonService.getPokemons({
                userId: "teste",
                query: query ? (query as string) : undefined,
                page: page ? parseInt(page as string) : 1, 
                orderBy: "pokeId",
                direction: "asc",
                pageSize: pageSize ? parseInt(pageSize as string) : 30,
            });

            return res.status(200).json(pokedex);
        } catch (error) {
            return res
                .status(500)
                .json(error);
        }
    }

    async insertPokemonInDataBase(req: Request, res: Response): Promise<Response> {
        try {
            const kanto = await this.pokeAPIService.getPokemons({
                offset: 0,
                limit: 151,
                final: 2,
            });

            const johto = await this.pokeAPIService.getPokemons({
                offset: 151,
                limit: 100,
                final: 2,
            });

            const hoenn = await this.pokeAPIService.getPokemons({
                offset: 251,
                limit: 135,
                final: 2,
            });

            const sinnoh = await this.pokeAPIService.getPokemons({
                offset: 386,
                limit: 108,
                final: 2,
            });

            const unova = await this.pokeAPIService.getPokemons({
                offset: 494,
                limit: 155,
                final: 2,
            });

            if ('message' in kanto) {
                console.error(kanto.message);
                throw new Error(kanto.message);
            }
            if ('message' in johto) {
                console.error(johto.message);
                throw new Error(johto.message);
            }
            if ('message' in hoenn) {
                console.error(hoenn.message);
                throw new Error(hoenn.message);
            }
            if ('message' in sinnoh) {
                console.error(sinnoh.message);
                throw new Error(sinnoh.message);
            }
            if ('message' in unova) {
                console.error(unova.message);
                throw new Error(unova.message);
            }

            const kantO = await this.pokemonService.insertPokemonInDataBase({
                pokedex: kanto,
            });

            const johtO = await this.pokemonService.insertPokemonInDataBase({
                pokedex: johto,
            });

            const hoenN = await this.pokemonService.insertPokemonInDataBase({
                pokedex: hoenn,
            });
            const sinnoH = await this.pokemonService.insertPokemonInDataBase({
                pokedex: sinnoh,
            });

            const unovaN = await this.pokemonService.insertPokemonInDataBase({
                pokedex: unova,
            });


            return res.status(200).json({
                message: "GetPokemons",
                poke: [
                    kanto,
                    johto,
                    hoenn,
                    sinnoh,
                    unova
                ]
            });
        } catch (error) {
            return res
                .status(500)
                .json(error);
        }
    }
}

export default PokemonController;