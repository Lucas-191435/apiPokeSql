import { User } from "@prisma/client";
import { GetAllArgs, IError, ServiceFn, TRows } from "../types/generics";
import { IPokemon } from "../modules/pokemon/pokeApi.service";

export namespace PokeAPIService {
  export namespace GetPokemon {
    export type Args = {
      limit: number;
      offset: number;
      final: number;
    };
    export type Result = IPokemon[] | IError
    ;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace GetPokemonDescription {
    export type Args = string;
    export type Result = {
      version: string,
      description: string,
    }[] | IError
    ;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace GetPokemonInfos {
    export type Args = string;
    export type Result = {
            descriptions: {
                [key: string]: string;
            }[],
            evolutionChain:  {name: string, id: number, level: number | null}[],
            regions: string[],
            sprites: {
                label: string,
                url: string,
            }[],
            stats: {
                name: string,
                value: number
            }[]
        } | IError
    ;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export interface IPokeAPIService {

    getPokemons: PokeAPIService.GetPokemon.Handler;
    pokemonDescription: PokeAPIService.GetPokemonDescription.Handler;
    pokemonInfos: PokeAPIService.GetPokemonInfos.Handler;
  }
}
