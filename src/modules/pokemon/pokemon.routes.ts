import { Request, Response, Router } from "express";
import { valideteUserToken } from "../../middlewares/valideteUserToken";
import { validateRequest } from "../../middlewares/validateRequest";

const routes = Router();
import PokemonController from "./pokemon.controller";
import { asyncHandler } from "../../utils/asyncHandler";
const pokemonController = new PokemonController();

routes.get("/pokemon", 
    valideteUserToken,
    asyncHandler(async (req) => {
        const { page, pageSize, query, types, weight } = req.query as any;
        
        return await pokemonController.getPokemons({
            page,
            pageSize,
            query,
            types,
            weight,
            userId: "teste"
        });
    })
);

routes.get("/pokemon/:id", valideteUserToken, asyncHandler(async (req) => {
        const { id } = req.params as any;
        return await pokemonController.getPokemon({
            id
        });
    })
)

routes.get("/insertPokemonInDataBase",  (req: Request, res: Response) => {
    pokemonController.insertPokemonInDataBase(req, res)
});


export default routes;