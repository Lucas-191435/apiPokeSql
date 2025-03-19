import { Account, AddressType } from "@prisma/client";
/* eslint-disable no-unused-vars */

export namespace Eazy {
  export namespace Account {
    export enum PhoneType {
      MOBILE = "MOBILE",
      RESIDENTIAL = "RESIDENTIAL",
      COMMERCIAL = "COMMERCIAL",
    }

    export type Phone = {
      phone_id: number;
      phone: string;
      phone_type: PhoneType;
      country_code: string;
      area_code: number;
      active: boolean;
      _id: string;
    };

    export type Address = {
      _id: string;
      address_id: number;
      address: string;
      number: number;
      country: string;
      neighborhood: string;
      city: string;
      state: string;
      zip_code: string;
      address_type: string;
      active: boolean;
    };

    export type Model = {
      _id: string;
      name: string;
      document: string;
      application_id: number;
      status: number;
      status_name: string;
      account_id: number;
      customer_id: number;
      entity_id: number;
      program_id: number;
      due_date_id: number;
      due_date_day: number;
      organization: string;
      max_credit_limit: number;
      total_credit_limit: number;
      addresses: Address[];
      phones: Phone[];
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  }

  export namespace Card {
    export enum CardType {
      PLASTIC = "PLASTIC",
      VIRTUAL = "VIRTUAL",
    }

    export enum CardStatus {
      CREATED = "CREATED",
      UNBOUND = "UNBOUND",
      NORMAL = "NORMAL",
      BLOCKED = "BLOCKED",
      CANCELED = "CANCELED",
    }

    export type Model = {
      _id: string;
      card_id: number;
      name: string;
      printed_name: string;
      type: CardType;
      status: CardStatus;
      contactless_enabled: boolean;
      cvv_rotation_interval_hours: number;
      transaction_limit: number;
      abu_enabled: boolean;
      customer_id: number;
      account_id: number;
      createdAt: string;
      updatedAt: string;
      expiration_date?: string;
      last_four_digits?: string;
      __v: number;
    };
  }

  export namespace Notification {
    export type CardCreated = {
      eventId: string;
      eventType: string;
      payload: {
        message: string;
        card: {
          accountId: number;
          programId: number;
          cardId: number;
          cardName: string;
          cardPrintedName: string;
          cardType: string;
          last4digits: string;
          cardStatus: string;
          contactLessEnabled: boolean;
          expireDate: string;
        };
      };
    };

    // TODO: verificar taxas
    export namespace Authorization {
      export type PayloadPostings = {
        fee_amount: number;
        cash_back_amount: number;
      };

      export type PayloadRates = {
        conversion_rate: number;
        cardholder_conversion_rate: number;
      };

      export type Payload = {
        account_id: number;
        card_id: number;
        customer_id: number;
        authorization_id: number;
        // authorization_category: AuthorizationCategory;
        cid: string;
        unique_cid: string;
        mti: string;
        principal_amount: number;
        contract_amount: number;
        installment_amount: number;
        local_amount: number;
        settlement_amount: number;
        number_of_installments: number;
        airport_tax: number;
        local_currency_code: string;
        cardholder_currency_code: string;
        settlement_currency_code: string;
        merchant_category_id: string;
        merchant_name: string;
        merchant_city: string;
        merchant_state_or_country: string;
        merchant_zip_code: string;
        soft_descriptor: string;
        card_acceptor_id: number;
        postings: PayloadPostings;
        rates: PayloadRates[];
        point_of_sale: number;
        validation_results: any[];
        processing_code: string;
        original_authorization_date_hour: Date;
        original_event_date_hour_utc: Date;
      };

      export type Response = {
        eventId: string;
        eventType: string;
        payload: Payload;
      };
    }
  }

  export namespace Organization {
    export type Model = {
      name: string;
      document: string;
      email: string;
      isActive: boolean;
      type: string;
      webhookNotificationUri: string;
      webhookNotificationToken: string;
      totalDependentsPerAccount: number;
      createdAt: Date;
      updatedAt: Date;
    };
  }

  export namespace Api {
    export type ValidationErrorResponse = {
      error?: {
        value: {
          name: string;
          limit: number;
          document: string;
          programId: number;
          dueDateId: number;
        };
        path: string;
        type: string;
        errors: string[];
        params: {
          value: string;
          originalValue: string;
          path: string;
        };
        inner: never[];
        name: string;
        message: string;
      };
      message?: string;
    };

    export namespace Login {
      export type Response = {
        message: string;
        organization: Organization.Model;
        token: string;
      };
    }

    export namespace GetPrograms {
      export type Response = {
        programs: {
          globalLimit: number;
          _id: string;
          name: string;
          is_active: boolean;
          program_id: number;
          due_dates: {
            id: number;
            day: number;
            active: boolean;
          }[];
          bin: {
            value: string;
            start_range: string;
            end_range: string;
          };
          brand: string;
          type: string;
          timezone: string;
          currency_numeric_code: string;
          country_code: string;
          organization: string;
          createdAt: string;
          updatedAt: string;
          __v: number;
        }[];
      };
    }

    export namespace CreateAccount {
      export type Response = {
        message: string;
        account: Account.Model;
      };

      export type Input = {
        name: Account.Model["name"];
        document: Account.Model["document"];
        limit: number;
        programId: number;
        dueDateId: number;
      };

      export namespace Address {
        export type Input = Pick<
          Eazy.Account.Address,
          | "address_type"
          | "address"
          | "number"
          | "neighborhood"
          | "zip_code"
          | "city"
          | "state"
          | "country"
        >;
      }

      export namespace Phone {
        export type Input = Pick<
          Account.Phone,
          "country_code" | "area_code"
        > & {
          number: Account.Phone["phone"];
          type: Account.Phone["phone_type"];
        };
      }
    }

    export namespace CreateCard {
      export type Response = {
        message: string;
        card: Eazy.Card.Model;
      };

      export type Input = Pick<
        Eazy.Card.Model,
        "name" | "transaction_limit" | "type"
      > & {
        embossing_name: string;
        accountId: Account["account_id"];
        customerId: Account["customer_id"];
      };
    }

    export namespace ActivateCard {
      export type Input = {
        cardId: string;
        accountId: string;
        cvv: string;
      };

      export type Response = {
        message: string;
        card: Card.Model;
      };
    }

    export namespace GetCvv {
      export type Input = {
        cardId: string;
        accountId: string;
      };

      export type Response = {
        cvv: string;
      };
    }

    export namespace GetCurrentOrganization {
      export type Response = {
        organization: Organization.Model;
      };
    }

    export namespace Accounts {
      export namespace ChangeDueDate {
        export type Body = {
          programId: number;
          dueDateId: number;
        };

        export type Response = {
          message: string;
        };
      }

      export namespace Limits {
        export namespace Update {
          export type Body = {
            max_credit_limit?: number;
            total_credit_limit?: number;
          };

          export type Response = {
            message: string;
          };
        }

        export namespace GetLimits {
          export type Response = {
            accountLimits: {
              max_credit_limit: number;
              total_installment_credit_limit: number;
              total_credit_limit: number;
              total_overdraft_limit: number;
              monthly_credit_limit: number;
              withdrawal_credit_limit: number;
              percentage_over_limit: number;
              available_total_installment_credit: number;
              available_withdrawal_credit: number;
              available_savings_account_limit: number;
              available_monthly_credit: number;
              available_credit_limit: number;
              held_funds: number;
            };
          };
        }
      }

      export namespace Phones {
        export namespace Update {
          export type Body = {
            country_code?: string;
            area_code?: string;
            number?: string;
            type?: string;
          };

          export type Response = {
            updatedPhone: {
              phone_id: number;
              phone: string;
              phone_type: string;
              country_code: string;
              area_code: string;
              active: boolean;
              _id: string;
            };
          };
        }

        export namespace List {
          export type Response = {
            phones: Omit<Account.Phone, "_id">[];
          };
        }
      }

      export namespace Addresses {
        export namespace Update {
          export type Body = {
            address_type?: AddressType;
            address?: string;
            number?: number;
            neighborhood?: string;
            zip_code?: string;
            city?: string;
            state?: string;
            country?: string;
            status?: boolean;
          };

          export type Response = {
            address: Body;
          };
        }

        export namespace List {
          export type Response = { addresses: Omit<Account.Address, "_id">[] };
        }
      }
    }

    export namespace Cards {
      export namespace UpdateCardInfo {
        export type Body = {
          transaction_limit?: number;
          contactless_enabled?: boolean;
        };
      }

      export namespace ChangeCardPassword {
        export type Body = {
          pin: string;
        };

        export type Response = {
          message: string;
        };
      }

      export namespace GetCardById {
        export type Response = {
          card: Card.Model;
        };
      }
    }

    export namespace Statements {
      export namespace GetNextAccountStatement {
        export type Body = {
          accountId: string;
        };

        export type Response = {
          statement: {
            id: number;
            cycle: number;
            due_date: string;
            best_transaction_date: string;
            minimum_payment_amount: number;
          };
        };
      }

      export namespace GetAllStatements {
        type Statement = {
          statementId: number;
          cycle: number;
          previousBalance: number;
          debits: number;
          currentBalance: number;
          postedDate: null;
          calendar: {
            calendar_id: number;
            program_due_date_id: number;
            program_id: number;
            cycle_closing_date: string;
            due_date: string;
            real_due_date: null;
          };
        };

        export type Params = {
          page: number;
          perPage: number;
        };

        export type Response = {
          statements: Statement[];
        };
      }

      export namespace GetStatementDetails {
        export type Body = {
          accountId: string;
        };

        export type Amount = {
          type: string;
          currency: string;
          value: number;
        };

        export type Authorization = {
          id: number;
          program_id: number;
          account_id: number;
          statement_id: number;
          installment: number;
          number_of_Installments: number;
          number_of_installments: number;
          soft_descriptor: string;
          processing_code: string;
          processing_description: string;
          customer_id: number;
          user_category: string;
          amount: Amount[];
          tax: null;
          event_date: string;
          event_datetime: string;
          payment_date: null;
          payment_datetime: null;
          created_at: string;
          entry_mode: string;
          transaction_type: {
            id: number;
            description: string;
            credit: boolean;
            posted_transaction: boolean;
          };
          card: {
            id: number;
            name: string;
          };
          authorization: {
            id: number;
            type: string;
            code: string;
            tracking_id: string;
            network: string;
          };
          merchant: {
            type: string;
            name: string;
            city: string;
            state: string;
            category: {
              code: string;
              description: string;
              group_name: string;
              network_group: string;
            };
          };
        };

        export type Response = {
          statementDetails: {
            accountId: string;
            accountName: string;
            accountDocument: string;
            customerId: number;
            organization: string;
            statementId: number;
            due_date: string;
            hasNext: boolean;
            numberOfAuthorizations: number;
            statementTotalValue: string;
            authorizations: Authorization[];
          };
        };
      }
    }
  }
}
