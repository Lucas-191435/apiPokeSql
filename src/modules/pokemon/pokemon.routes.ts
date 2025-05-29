import { Request, Response, Router } from "express";
import { valideteUserToken } from "../../middlewares/valideteUserToken";
import { validateRequest } from "../../middlewares/validateRequest";

const routes = Router();
import PokemonController from "./pokemon.controller";
const pokemonController = new PokemonController();

routes.get("/pokemon", (req: Request, res: Response) => {
    pokemonController.getPokemons(req, res)
});


routes.get("/insertPokemonInDataBase", (req: Request, res: Response) => {
    pokemonController.insertPokemonInDataBase(req, res)
});


export default routes;