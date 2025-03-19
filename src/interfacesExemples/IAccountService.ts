import { Account } from "@prisma/client";
import { GetAllArgs, IError, ServiceFn, TRows } from "../types/generics";

export namespace AppAccountService {
  export namespace GetAllAccountDTO {
    export type Args = GetAllArgs<Account>;
    export type Result = TRows<
      | {
          id: string;
          document: string;
          name: string;
          createdAt: Date;
        }
      | IError
    >;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace Create {
    export type Args = {
      data: {
        name: string;
        document: string;
        email: string;
      };
      file?: any;
    };
    export type Result = Account | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace FindByDocument {
    export type Args = string;
    export type Result = Account | null | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export interface IAccountService {
    findAndCountAll: AppAccountService.GetAllAccountDTO.Handler;
    create: AppAccountService.Create.Handler;
    findByDocument: AppAccountService.FindByDocument.Handler;
  }
}
