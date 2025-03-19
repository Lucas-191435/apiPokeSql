import axios, { AxiosInstance } from "axios";
import { Environment } from "../utils/Environment";
import { Eazy } from "../types/Eazy";

class EazyProvider {
  public instance: AxiosInstance;

  private token: string | null;

  constructor() {
    this.token = null;

    this.instance = axios.create({
      baseURL: Environment.EazyBaseUrl,
    });

    this.instance.interceptors.request.use(async (config) => {
      // Se ainda não tiver um token ou o token expirou, obtém um novo token
      if (!this.token) {
        this.token = await this.getNewAccessToken();
      }

      // Adiciona o token de acesso ao cabeçalho 'Authorization'

      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${this.token}`;

      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        try {
          const prevRequest = error?.config;
          if (
            (error?.response?.status === 401 ||
              error?.response?.status === 403) &&
            !prevRequest?.sent
          ) {
            prevRequest.sent = true;
            this.token = await this.getNewAccessToken();

            if (!this.token) throw new Error("Erro ao atualizar sessão!");

            this.instance.defaults.headers.common.Authorization = `Bearer ${this.token}`;

            return this.instance(prevRequest);
          }

          return Promise.reject(error);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    );
  }

  private getNewAccessToken = async () => {
    const response = await axios.post<Eazy.Api.Login.Response>(
      `${Environment.EazyBaseUrl}/organizations/login`,
      Environment.EazyCredentials
    );

    console.log(response.data)
    return response.data.token;
  };

  public get apiInstance() {
    return this.instance;
  }
}

const eazyProvider = new EazyProvider();

export default eazyProvider;
