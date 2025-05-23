import { User } from "@prisma/client";
import { GetAllArgs, IError, ServiceFn, TRows } from "../types/generics";
import { InferType } from "yup";
import { validateTokenForResetPasswordSchema } from "../modules/user/user.schema";

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
        password: string;
        email: string;
        role: "CLIENT" | "ADMIN";
      };
      files?: any;
    };
    export type Result =  Pick<User, 'name' | 'email' | 'avatar'> | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace getUser {
    export type Args = {
      userId: string
    };
    export type Result = User | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace updateUser {
    export type Args = {
      userId: string;
      data: {
        name?: string;
        password?: string;
        email?: string;
        role?: "CLIENT" | "ADMIN";
      };
    };
    export type Result = User | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace deleteUser {
    export type Args = {
      userId: string
    };
    export type Result = User | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace FindByDocument {
    export type Args = string;
    export type Result = User | null | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace Login {
    export type Args = {
      email: string,
      password: string
    };
    export type Result =
      | {user: Pick<User, 'name' | 'email' | 'avatar' | 'role' | 'id'>, token: string}
      | null
      | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace ResetPassword {
    export type Args = {
      email: string,
    };
    export type Result = String
      | null
      | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace ValidateTokenForResetPassword {
    export type Args = InferType<typeof validateTokenForResetPasswordSchema>;
    export type Result = String
      | null
      | IError;
    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export interface IUserService {

    create: AppUserService.Create.Handler;

    // loginUserFistStep: AppUserService.LoginUserFistStep.Handler;
    // loginUserSecondStep: AppUserService.LoginUserSecondStep.Handler;
  }
}
