import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";
import { transformPokemonData } from "../../utils/utils";




class MyPokemonService {
    getAllPokemonsOfUser = async () => {
        try {
            const pokemons = await prismaClient.pokemon.findMany({
                select: {
                    id: true,
                    pokeId: true,
                    name: true
                },
                orderBy: {
                    pokeId: 'asc'
                }
            });
            return pokemons;
        } catch (error) {
            console.error("Error fetching pokemons from database:", error);
            throw error;
        }
    }

}

export default MyPokemonService;