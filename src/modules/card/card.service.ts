import { Prisma } from "@prisma/client";
import prismaClient from "../../database/index";
import { AppCardService } from "../../interfaces/ICardService";
import { whatsApiClient } from "../../services/whatsAppAPI";
import axios from "axios";
import { JsonWebTokenError, sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { generateCode } from "../../utils/helpers";

JsonWebTokenError;
class CardService implements AppCardService.ICardService {
  create: AppCardService.Create.Handler = async ({ data }) => {
    try {
      const { name,
        printed_name,
        accountId,

        transaction_limit,
        type,
      } = data;


      const account = await prismaClient.account.findFirst({
        where: { id: accountId },
      });

      if (!account) {
        throw { message: "Conta não encontrada", statusCode: 400 };
      }

      const card = await prismaClient.card.create({
        data: {
          name,
          printed_name,
          accountId,
          type,
          transaction_limit: transaction_limit || account.max_credit_limit,
          cvv_rotation_interval_hours: Math.floor(100 + Math.random() * 900)
        },
      });
      return card;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === "P2002" &&
          error.meta?.target === "Card_document_key"
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

  findAndCountAll: AppCardService.GetAllCardDTO.Handler = async ({
    page,
    pageSize,
    query,
  }) => {
    try {
      const { } = JSON.parse(query);

      const conditions: Array<Record<string, any>> = [];
      const where: Prisma.CardFindManyArgs["where"] = {
        AND: conditions.length > 0 ? conditions : undefined,
      };

      const count = await prismaClient.card.count({ where });
      const cards = await prismaClient.card.findMany({
        where: {},
      })

      return {
        count,
        rows: cards,
        pageSize,
        page,
      }

    } catch (error) {

      throw {
        message: 'Falhou pegar contas',
        statusCode: 500,
        details: error,
      };
    }
  }

  findById: AppCardService.FindById.Handler = async (id) => {
    try {
      const card = await prismaClient.card.findUnique({ where: { id } });

      if (!card) {
        throw { message: "Cartão não encontrado", statusCode: 404 };
      }

      return card;
    } catch (error) {
      throw {
        message: 'Falhou ao pegar cartão',
        statusCode: 500,
        details: error,
      };
    }
  }

  cardsByAccount: AppCardService.CardsByAccount.Handler = async (id) => {
    try {
      const cards = await prismaClient.card.findMany({ where: { accountId: id } })

      if (!cards) {
        throw { message: "Cartões não encontrada", statusCode: 404 };
      }

      if (cards.length < 1) {
        throw { message: "Conta sem cartão", statusCode: 404 };
      }

      return cards;
    } catch (error) {
      console.log(error)
      throw {
        message: 'Falhou pegar contas',
        statusCode: 500,
        details: error,
      };
    }
  }

  unblock: AppCardService.CardsByAccount.Handler = async (id) => {
    try {
      const cards = await prismaClient.card.findMany({ where: { accountId: id } })

      if (!cards) {
        throw { message: "Cartões não encontrada", statusCode: 404 };
      }

      if (cards.length < 1) {
        throw { message: "Conta sem cartão", statusCode: 404 };
      }

      return cards;
    } catch (error) {
      console.log(error)
      throw {
        message: 'Falhou pegar contas',
        statusCode: 500,
        details: error,
      };
    }
  }

  activate: AppCardService.Activate.Handler = async ({
    id,
    organizationId,
    accountId,
    cvv
  }) => {
    try {
      // const cards = await prismaClient.card.findMany({ where: { accountId: id } })

      // if (!cards) {
      //   throw { message: "Cartões não encontrada", statusCode: 404 };
      // }

      // if (cards.length < 1) {
      //   throw { message: "Conta sem cartão", statusCode: 404 };
      // }

      return null;
    } catch (error) {
      console.log(error)
      throw {
        message: 'Falhou pegar contas',
        statusCode: 500,
        details: error,
      };
    }
  }
}

export default CardService;
