import { User } from "@prisma/client";
import { GetAllArgs, IError, ServiceFn, TRows } from "../types/generics";
import { IPokemon } from "../modules/pokemon/pokeApi.service";

export namespace AppPokemonService {
  export namespace GetPokemons {
    export type Args = GetAllArgs<{
      userId: string;
      types?: string[];
      weight?: 'small' | 'medium' | 'large';
    }>;
    export type Result = {
      count: number;
      pokemon: IPokemon[]
    } | IError
      //  export type Result = { message: string } | IError
      ;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace GetPokemon {
    export type Args =  number | string;
    export type Result = IPokemon | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace InsertPokemonInDataBase {
    export type Args = {
      pokedex: IPokemon[]
    };
    export type Result = IPokemon[] | IError
      ;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }
  export interface IPokemonService {
    getPokemons: AppPokemonService.GetPokemons.Handler;
    getPokemon: AppPokemonService.GetPokemon.Handler;
    insertPokemonInDataBase: AppPokemonService.InsertPokemonInDataBase.Handler;
  }
}
