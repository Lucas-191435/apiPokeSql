import { IError, ResultVoidOrError } from "../types/generics";
import { HBSCtx } from "../types/HandlebarsContexts";

export namespace AppMailProvider {
    export namespace SendEmail {
        export type Args = {
            to: string;
            subject: string;
            message?: string;
            template: HBSCtx.Templates;
            context: HBSCtx.RecoverPassword | HBSCtx.validateEmail | HBSCtx.testEmail;
        };
        // export type Result = void | IError;
        export type Handler = (args: Args) => ResultVoidOrError;
    }

    export interface IMailProvider {
        sendEmail: SendEmail.Handler;
    }
}