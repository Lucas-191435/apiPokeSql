/* eslint-disable no-unused-vars */

import {
  BtgCredentials,
  EazyEnvCredentials,
  EzyEnvOrganizationData,
} from "../types/App";

enum EnvironmentType {
  local = "local",
  test = "test",
  production = "production",
}

class Environment {
  static get isLocalEnvironment(): boolean {
    return process.env.ENVIRONMENT === EnvironmentType.local;
  }

  static get isSandboxEnvironment(): boolean {
    return process.env.ENVIRONMENT === EnvironmentType.test;
  }

  static get isProductionEnvironment(): boolean {
    return process.env.ENVIRONMENT === EnvironmentType.production;
  }

  static get Port(): string {
    return `${process.env.PORT}`;
  }

  static get Url(): string {
    return `${process.env.APP_URL}`;
  }

  static get WebUrl(): string {
    return `${process.env.WEB_URL}`;
  }

  static get EazyBaseUrl(): string {
    return `${process.env.EAZY_BASE_URL}`;
  }

  static get EazyCredentials(): EazyEnvCredentials {
    try {
      return {
        email: `${process.env.EAZY_CREDENTIALS_EMAIL}`,
        password: `${process.env.EAZY_CREDENTIALS_PASSWORD}`,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        "🆘 \t file: Environment.ts:41 \t getEazyCredentials \t error:",
        error
      );
      throw error;
    }
  }

  static get EazyOrganizationData(): EzyEnvOrganizationData {
    try {
      return JSON.parse(process.env.EAZY_ORGANIZATION_DATA as string);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        "🆘 \t file: Environment.ts:41 \t getEazyCredentials \t error:",
        error
      );
      throw error;
    }
  }

  static get BtgCredentials(): BtgCredentials {
    try {
      return JSON.parse(
        `{"clientId": "${process.env.BTG_CLIENT_ID}", "clientSecret": "${process.env.BTG_CLIENT_SECRET}", "accountId": "${process.env.BTG_ACCOUNT_ID}"}`
      ) as BtgCredentials;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("🆘 \t BtgCredentials \t error:", error);
      throw error;
    }
  }

  static get BtgBaseUrl(): string {
    return `${process.env.BTG_BASE_URL}`;
  }
}

export { Environment };
