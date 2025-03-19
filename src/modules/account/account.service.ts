import { Prisma } from "@prisma/client";
import prismaClient from "../../database/index";
import { AppAccountService } from "../../interfaces/IAccountService";
import { whatsApiClient } from "../../services/whatsAppAPI";
import axios from "axios";
import { JsonWebTokenError, sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { generateCode } from "../../utils/helpers";
import { Mail } from "../../utils/Mail";

JsonWebTokenError;
class AccountService implements AppAccountService.IAccountService {
  create: AppAccountService.Create.Handler = async ({ data }) => {
    try {
      const { name, document, email } = data;

      const account = await prismaClient.account.create({
        data: {
          name,
          document,
        },
      });
      return account;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === "P2002" &&
          error.meta?.target === "Account_document_key"
        ) {
          throw {
            message: "Já existe uma conta com esse documento!",
            statusCode: 409,
          };
        }
      }

      throw {
        message: "Falhou ao criar a conta!",
        statusCode: 500,
        details: error,
      };
    }
  };

  findAndCountAll: AppAccountService.GetAllAccountDTO.Handler = async ({
    page,
    pageSize,
    query,
  }) => {
    try {
      const {} = JSON.parse(query);

      const conditions: Array<Record<string, any>> = [];
      const where: Prisma.AccountFindManyArgs["where"] = {
        AND: conditions.length > 0 ? conditions : undefined,
      };

      const count = await prismaClient.account.count({ where });
      const accounts = await prismaClient.account.findMany({
        where: {},
        select: {
          id: true,
          document: true,
          name: true,
          createdAt: true,
        },
      });

      return {
        count,
        rows: accounts,
        pageSize,
        page,
      };
    } catch (error) {
      throw {
        message: "Falhou pegar contas",
        statusCode: 500,
        details: error,
      };
    }
  };

  findByDocument: AppAccountService.FindByDocument.Handler = async (
    document
  ) => {
    try {
      if (!document) {
        throw { message: "Documento não fornecido", statusCode: 400 };
      }
      const account = await prismaClient.account.findFirst({
        where: { document },
      });

      return account;
    } catch (error) {
      throw {
        message: "Falhou pegar contas",
        statusCode: 500,
        details: error,
      };
    }
  };
}

export default AccountService;
