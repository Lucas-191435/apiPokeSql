import { AppPokemonService } from "../../interfaces/IPokemon";
import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";

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


    insertPokemonInDataBase: AppPokemonService.InsertPokemonInDataBase.Handler = async ({ pokedex }) => {
        try {
            const transformedPokedex = pokedex.map((pokemon) => {
                return {
                    pokeId: pokemon.number,
                    name: pokemon.name,
                    types: JSON.stringify(pokemon.types), // ou pokemon.types.join(',') se preferir
                    abilities: JSON.stringify(pokemon.abilities),
                    region: pokemon.region as Region, // certifique-se que seja um valor válido
                    height: pokemon.height,
                    weight: pokemon.weight,
                    img1: pokemon.img1 || null,
                    img2: pokemon.img2 || null,
                    img3: pokemon.img3 || null,
                    createdAt: new Date(), // opcional, pois o schema já usa default(now())
                    updatedAt: new Date(), // opcional, pois o schema já usa @updatedAt
                };
            });
            const aaa = await prismaClient.pokemon.createMany({
                data: transformedPokedex,
            });

            // const user = await prismaClient.pokemon.create({
            //  data: {
            //     pokeId: 3,
            //     name: "venusaur",
            //     types: JSON.stringify(["grass", "poison"]),
            //     abilities: JSON.stringify(["overgrow", "chlorophyll"]),
            //     region: "KANTO",
            //     height: 20,
            //     weight: 1000,
            //     img1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/3.gif",
            //     img2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
            //     img3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png"
            //  }
            // });
            return [{
                number: 3,
                name: "venusaur",
                types: [
                    "grass",
                    "poison"
                ],
                abilities: [
                    "overgrow",
                    "chlorophyll"
                ],
                region: "Kanto",
                height: 20,
                weight: 1000,
                img1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/3.gif",
                img2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
                img3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png"
            }]
        } catch (error) {
            throw error
        }
    }
}

export default PokemonService;