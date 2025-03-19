import { Eazy } from "../types/Eazy";
import { ServiceFn } from "../types/generics";

export namespace IEazyService {
  export namespace CreateAccount {
    export type Args = Omit<Eazy.Api.CreateAccount.Input, "programId">;

    export type Result = Eazy.Api.CreateAccount.Response;

    export type Handler = ServiceFn<Args, Promise<Result>>;

    export namespace Address {
      export type Args = {
        eazyAccountId: string;
        addressData: Eazy.Api.CreateAccount.Address.Input;
      };

      export type Result = Eazy.Api.CreateAccount.Response;

      export type Handler = ServiceFn<Args, Promise<Result>>;
    }

    export namespace Phone {
      export type Args = {
        eazyAccountId: string;
        phoneData: Eazy.Api.CreateAccount.Phone.Input;
      };

      export type Result = Eazy.Api.CreateAccount.Response;

      export type Handler = ServiceFn<Args, Promise<Result>>;
    }
  }

  export namespace CreateCard {
    export type Args = Eazy.Api.CreateCard.Input;

    export type Result = Eazy.Api.CreateCard.Response;

    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace GetPrograms {
    export type Result = Eazy.Api.GetPrograms.Response;

    export type Handler = ServiceFn<void, Promise<Result>>;
  }

  export namespace ActivateCard {
    export type Args = Eazy.Api.ActivateCard.Input & {
      pin: string;
    };

    export type Result = Eazy.Api.ActivateCard.Response;

    export type Handler = ServiceFn<Args, Promise<Result | null>>;
  }

  export namespace GetCvv {
    export type Args = Eazy.Api.GetCvv.Input;

    export type Result = Eazy.Api.GetCvv.Response;

    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace UpdateAccountData {
    export type Args = {
      accountId: string;
      accountData?: {
        limits?: Eazy.Api.Accounts.Limits.Update.Body;
        phone?: Eazy.Api.Accounts.Phones.Update.Body;
        address?: Eazy.Api.Accounts.Addresses.Update.Body;
        dueDate?: Eazy.Api.Accounts.ChangeDueDate.Body;
      };
      cardData?: {
        cardId: string;
        cardInfo: Eazy.Api.Cards.UpdateCardInfo.Body;
      };
    };

    export type Handler = ServiceFn<Args, Promise<void>>;
  }

  export namespace GetCard {
    export type Args = {
      cardId: string;
      accountId: string;
    };

    export type Result = Eazy.Api.Cards.GetCardById.Response | null;

    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace GetAllStatements {
    export type Args = Eazy.Api.Statements.GetAllStatements.Params & {
      accountId: string;
    };

    export type Result = Eazy.Api.Statements.GetAllStatements.Response;

    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace GetStatementDetails {
    export type Args = Eazy.Api.Statements.GetStatementDetails.Body & {
      statementId: number;
    };

    export type Result = Eazy.Api.Statements.GetStatementDetails.Response;

    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace GetNextAccountStatement {
    export type Args = Eazy.Api.Statements.GetNextAccountStatement.Body;

    export type Result = Eazy.Api.Statements.GetNextAccountStatement.Response;

    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export namespace GetAccountLimits {
    export type Args = {
      accountId: string;
    };

    export type Result = Eazy.Api.Accounts.Limits.GetLimits.Response;

    export type Handler = ServiceFn<Args, Promise<Result>>;
  }

  export type HandleGetErrorMessageHandler = ServiceFn<unknown, string>;

  export type Index = {
    createAccount: CreateAccount.Handler;
    // createAccountAddress: CreateAccount.Address.Handler;
    // createAccountPhone: CreateAccount.Phone.Handler;
    // createCard: CreateCard.Handler;
    // getCard: GetCard.Handler;
    handleGetErrorMessage: HandleGetErrorMessageHandler;
    // getPrograms: GetPrograms.Handler;
    // getCvv: GetCvv.Handler;
    // activateCard: ActivateCard.Handler;
    // updateAccountData: UpdateAccountData.Handler;
    // getNextAccountStatement: GetNextAccountStatement.Handler;
    // getAllStatements: GetAllStatements.Handler;
    // getStatementDetails: GetStatementDetails.Handler;
    // getAccountLimits: GetAccountLimits.Handler;
  };
}
