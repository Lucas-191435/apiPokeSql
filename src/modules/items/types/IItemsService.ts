import { GetAllArgs, IError, ServiceFn, TRows } from "../../../types/generics";
import { Item } from "@prisma/client";



export namespace AppItemsService {
  export namespace GetAllItems {
    export type Args = GetAllArgs<{
      name?: string;
      category?: string;
      isConsumable?: boolean;
      isHeldItem?: boolean;
    }>;
    export type Result = TRows<
      | Item
      | IError
    >;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }


  export interface IItemService {
    getItems: AppItemsService.GetAllItems.Handler;
  }
}