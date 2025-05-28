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

  export interface IPokeAPIService {

    getPokemons: PokeAPIService.GetPokemon.Handler;

  }
}
