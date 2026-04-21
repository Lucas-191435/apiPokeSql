import { Request, Response, Router } from "express";
import { valideteUserToken, AuthenticatedRequest } from "../../middlewares/valideteUserToken";
import { validateRequest } from "../../middlewares/validateRequest";

const routes = Router();
import PokemonController from "./myPokemon.controller";
import { asyncHandler } from "../../utils/asyncHandler";
const pokemonController = new PokemonController();


routes.get("/my-pokemon", valideteUserToken, asyncHandler(async (req: AuthenticatedRequest) => {
        console.log("Received request for user's pokemon from user:", req.user);
        return await pokemonController.getAllPokemonOfUser({
            id: req.user!
        });
    })
)

routes.post("/my-pokemon/capture", valideteUserToken, asyncHandler(async (req: AuthenticatedRequest) => {
        console.log("Received request for pokemon capture from user:", req.user);
        console.log("Request body:", req.body);
        return await pokemonController.capturePokemon({
            userId: req.user!,
            pokemonId: req.body.id,
            nickname: req.body.nickname
        });
    })
)




export default routes;