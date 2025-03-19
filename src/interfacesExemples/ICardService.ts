import { Card } from "@prisma/client";
import { GetAllArgs, IError, ServiceFn, TRows } from "../types/generics";

export namespace AppCardService {
  export namespace GetAllCardDTO {
    export type Args = GetAllArgs<Card>
    export type Result = TRows<Card | IError>;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace Create {
    export type Args = {
      data: {
        name: string,
        printed_name: string,
        accountId: string,

        transaction_limit: number
        type: "PLASTIC" | "VIRTUAL"
      };
      file?: any;
    };
    export type Result = Card | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace Activate {
    export type Args = {
      id: string,
      organizationId: string,
      accountId: string,
      cvv: number,
    };
    export type Result = null | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace FindById {
    export type Args = string
    export type Result = Card | null | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace CardsByAccount {
    export type Args = string
    export type Result = Card[] | null | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }
  export interface ICardService {
    // findAndCountAll: AppCardService.GetAllCardDTO.Handler;
    create: AppCardService.Create.Handler;
    // findByDocument: AppCardService.FindByDocument.Handler;

    cardsByAccount: AppCardService.CardsByAccount.Handler;
    findById: AppCardService.FindById.Handler;
    activate: AppCardService.Activate.Handler;
  }
}
