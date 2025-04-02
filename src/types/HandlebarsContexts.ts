export namespace HBSCtx {
    export type Templates = "RecoverPassword" | "validateEmail" | "testEmail";

    export type RecoverPassword = {
        name: string;
        recoveryToken: string;
        // Exemple: "http://localhost:3333/assets/MindGroup.png"
        logoUrl: string;
        // Example: "https://mindconsulting.com.br/"
        appUrl: string;
      };

      export type validateEmail = {
        name: string;
        // Exemple: "http://localhost:3333/assets/MindGroup.png"
        logoUrl: string;
        // Example: "https://mindconsulting.com.br/"
        appUrl: string;
        randomKet: string
      };

      export type testEmail = {
        name: string;
      };
}