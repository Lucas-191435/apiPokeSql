import { User } from "@prisma/client";
import { GetAllArgs, IError, ServiceFn, TRows } from "../types/generics";

export namespace AppUserService {
  export namespace GetAllUserDTO {
    export type Args = GetAllArgs<User>;
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
        role: "CLIENT" | "ADMIN";
        card: {
          transaction_limit?: number,
          printed_name: "cartao teste",
          type: "PLASTIC" | "VIRTUAL"
        };

        accountAddress: {
          address: string,
          number: number,
          country_code: string,
          country: string,
          neighborhood: string,
          city: string,
          state: string,
          zip_code: string,
          address_type: "COMMERCIAL" | "RESIDENTIAL" | "OTHER",
          mailing_address: boolean,
          active: boolean
        };

        accountPhone: {
          phone: string,
          phone_type: string,
          country_code: string,
          area_code: number,
          active: true
        }
      };
      file?: any;
    };
    export type Result = User | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace FindByDocument {
    export type Args = string;
    export type Result = User | null | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace LoginUserFistStep {
    export type Args = string;
    export type Result =
      | {
        document: string;
        name: string;
      }
      | null
      | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace LoginUserSecondStep {
    export type Args = string;
    export type Result =
      | {
        document: string;
        name: string;
        id: string;
        token: string;
      }
      | null
      | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export interface IUserService {

    create: AppUserService.Create.Handler;

    loginUserFistStep: AppUserService.LoginUserFistStep.Handler;
    loginUserSecondStep: AppUserService.LoginUserSecondStep.Handler;
  }
}
