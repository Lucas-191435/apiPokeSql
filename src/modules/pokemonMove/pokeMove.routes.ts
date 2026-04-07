import { Request, Response, Router } from "express";
import { valideteUserToken } from "../../middlewares/valideteUserToken";
import { validateRequest } from "../../middlewares/validateRequest";

const routes = Router();
import PokemonController from "./pokeMove.controller";
import { asyncHandler } from "../../utils/asyncHandler";
const pokemonController = new PokemonController();


routes.get("/pokemon-move/:id", valideteUserToken, asyncHandler(async (req) => {
        const { id } = req.params as any;
        console.log("Received request for pokemon move with id:", id);
        return await pokemonController.getPokemonMove({
            id
        });
    })
)




export default routes;