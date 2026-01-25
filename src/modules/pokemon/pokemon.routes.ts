import { Request, Response, Router } from "express";
import { valideteUserToken } from "../../middlewares/valideteUserToken";
import { validateRequest } from "../../middlewares/validateRequest";

const routes = Router();
import PokemonController from "./pokemon.controller";
const pokemonController = new PokemonController();

routes.get("/pokemon", valideteUserToken, (req: Request, res: Response) => {
     pokemonController.getPokemons(req, res)
});

routes.get("/pokemon/:id", valideteUserToken, (req: Request, res: Response) => {
    pokemonController.getPokemon(req, res)
});


routes.get("/insertPokemonInDataBase", valideteUserToken, (req: Request, res: Response) => {
    pokemonController.insertPokemonInDataBase(req, res)
});


export default routes;