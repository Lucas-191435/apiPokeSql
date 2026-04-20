import { Request, Response, Router } from "express";
import { valideteUserToken } from "../../middlewares/valideteUserToken";
import { validateRequest } from "../../middlewares/validateRequest";

const routes = Router();
import PokemonController from "./myPokemon.controller";
import { asyncHandler } from "../../utils/asyncHandler";
const pokemonController = new PokemonController();


routes.get("/my-pokemon/:id", valideteUserToken, asyncHandler(async (req) => {
        const { id } = req.params as any;
        console.log("Received request for pokemon move with id:", id);
        return await pokemonController.getAllPokemonOfUser({
            id
        });
    })
)

routes.post("/my-pokemon/capture/:id", valideteUserToken, asyncHandler(async (req) => {
        const { id } = req.params as any;
        console.log("Received request for pokemon move with id:", id);
        return await pokemonController.capturePokemon({
            userId: id,
            pokemonId: req.body.pokemonId
        });
    })
)




export default routes;