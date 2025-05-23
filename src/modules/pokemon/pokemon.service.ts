import { AppPokemonService } from "../../interfaces/IPokemon";
import { IError } from "../../types/generics";

class PokemonService implements AppPokemonService.IPokemonService {
    getPokemons: AppPokemonService.GetPokemons.Handler = async ({ }) => {
        try {
            return {
                message: "Pokemons"
            }
        } catch (error) {
            throw error
        }
    }


    insertPokemonInDataBase: AppPokemonService.InsertPokemonInDataBase.Handler = async ({ userId }) => {
        try {
            // console.log("userId", userId);
            return {
                message: "Pokemons"
            }
        } catch (error) {
            throw error
        }
    }
}

export default PokemonService;