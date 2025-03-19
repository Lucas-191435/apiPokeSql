
import { IEazyService } from "../../interfaces/IEazyService";
import { AxiosResponse, isAxiosError } from "axios";
import { normalizeStringsFromObject } from "../../utils/helpers";
import { Environment } from "../../utils/Environment";
import { EzyEnvOrganizationData } from "../../types/App";
import { Eazy } from "../../types/Eazy";
import eazyProvider from "../../provider/EazyProvider";

export class EazyService implements IEazyService.Index {
    private organizationData: EzyEnvOrganizationData;

    constructor() {
        this.organizationData = Environment.EazyOrganizationData;
    }

    createAccount: IEazyService.CreateAccount.Handler = async (data) => {
        try {
            const response = await eazyProvider.apiInstance.post<
                Eazy.Api.CreateAccount.Response,
                AxiosResponse<Eazy.Api.CreateAccount.Response>,
                Eazy.Api.CreateAccount.Input
            >(
                "/accounts",
                normalizeStringsFromObject<Eazy.Api.CreateAccount.Input>({
                    ...data,
                    programId: this.organizationData.programId,
                })
            );

            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(
                "🆘 \t file: eazy.client.ts:20 \t createAccount:IEazyService.CreateAccount.Handler= \t error:",
                error
            );

            throw new Error(this.handleGetErrorMessage(error));
        }
    };

    handleGetErrorMessage: IEazyService.HandleGetErrorMessageHandler = (error) =>
        isAxiosError<Eazy.Api.ValidationErrorResponse>(error)
          ? error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Erro ao integrar com parceiro"
          : (error as Error)?.message || "Erro ao interno ao integrar com parceiro";
}



