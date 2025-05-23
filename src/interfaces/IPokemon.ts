import { User } from "@prisma/client";
import { GetAllArgs, IError, ServiceFn, TRows } from "../types/generics";

export namespace AppPokemonService {
  export namespace GetPokemons {
    export type Args = GetAllArgs<{
      userId: string;
    }>;
    export type Result = {message: string} | IError
    ;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace InsertPokemonInDataBase {
    export type Args = {
      userId: string;
    };
    export type Result = {message: string} | IError
    ;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }
  export interface IPokemonService {

    getPokemons: AppPokemonService.GetPokemons.Handler;
    insertPokemonInDataBase: AppPokemonService.InsertPokemonInDataBase.Handler;

  }
}
