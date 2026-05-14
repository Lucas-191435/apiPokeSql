import { Request, Response, Router } from "express";
import { valideteUserToken, AuthenticatedRequest } from "../../middlewares/valideteUserToken";
import { validateRequest } from "../../middlewares/validateRequest";

const routes = Router();
import PokemonController from "./myPokemon.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { updatePokemonMovesSchema } from "./myPokemon.schema";
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


routes.delete("/my-pokemon/leave/:id", valideteUserToken, asyncHandler(async (req: AuthenticatedRequest) => {
        return await pokemonController.leavePokemon({
            userId: req.user!,
            pokemonId: req.params.id,
        });
    })
)

routes.put("/my-pokemon/update-team", valideteUserToken, asyncHandler(async (req: AuthenticatedRequest) => {

        console.log("teams", req.body);
        return await pokemonController.updatePokemonTeam({
            userId: req.user!,
            teamName: req.body.teamName,
            team: req.body.team,
        });
    })
)

routes.put("/my-pokemon/update-moves", valideteUserToken, asyncHandler(async (req: AuthenticatedRequest) => {

        console.log("moves", req.body);
        return await pokemonController.updatePokemonMoves({
            userId: req.user!,
            data: req.body,
        });
    })
)
routes.put("/my-pokemon/moves", valideteUserToken,  validateRequest(updatePokemonMovesSchema),  asyncHandler(async (req: AuthenticatedRequest) => {

        return await pokemonController.updatePokemonMoves({
            userId: req.user!,
            data: req.body,
        });
    })
)




export default routes;