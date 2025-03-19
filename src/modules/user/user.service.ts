import { Prisma } from "@prisma/client";
import prismaClient from "../../database/index";
import { AppUserService } from "../../interfaces/IUserService";
import { whatsApiClient } from "../../services/whatsAppAPI";
import axios from "axios";
import { JsonWebTokenError, sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { generateCode } from "../../utils/helpers";
import { Mail } from "../../utils/Mail";

JsonWebTokenError;
class UserService implements AppUserService.IUserService {
  create: AppUserService.Create.Handler = async ({ data }) => {
    try {
      //Código em desenvolvimento!!!
      // Verificando se o documento já existe na nossa base de dados
      const userAlreadyExists = await prismaClient.user.findFirst({
        where: { document: data.document },
      });
      const accountAlreadyExists = await prismaClient.account.findFirst({
        where: { document: data.document },
      });
      if (userAlreadyExists || accountAlreadyExists) {
        throw {
          message: "Já existe um usuário com esse documento!",
          statusCode: 409,
        };
      }

      // Criando um novo usuário na nossa base de dados
      const { 
        name,
        document,
        email,
        role } = data

        const { printed_name, type, transaction_limit } = data.card;
        
      //Caso uma operação de erro 

      const { user, card, account } = await prismaClient.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            name,
            document,
            email,
            role,
          },
        });

        const account = await prisma.account.create({
          data: {
            name,
            document,
            userId: user.id,
          },
        });

        const card = await prisma.card.create({
          data: {
            name,
            printed_name,
            type,
            transaction_limit,
            accountId: account.id,
          },
        })

        await prisma.accountPhone.create({
          data: {
            ...data.accountPhone,
            accountId: account.id, // Associa ao account
          },
        })

        await prisma.accountAddress.create({
          data: {
            ...data.accountAddress,
            accountId: account.id, // Associa ao account
          },
        })

        const updatedAccount = await prisma.account.update({
          where: { id: account.id },
          data: {
            main_card_id: card.id, // Associa ao account
          },
        });

        return { user, account: updatedAccount, card };
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === "P2002" &&
          error.meta?.target === "User_document_key"
        ) {
          throw {
            message: "Já existe uma conta com esse documento!",
            statusCode: 409,
          };
        }
      }
      console.log(error);
      throw {
        message: "Falhou ao criar a conta!",
        statusCode: 500,
        details: error,
      };
    }
  };


  findByToken: AppUserService.FindByDocument.Handler = async (id) => {
    try {
      if (!id) {
        throw { message: "Conta não fornecida!", statusCode: 400 };
      }
      const user = await prismaClient.user.findFirst({ where: { id } });

      return user;
    } catch (error) {
      throw {
        message: "Falhou pegar contas",
        statusCode: 500,
        details: error,
      };
    }
  };

  loginUserFistStep: AppUserService.LoginUserFistStep.Handler = async (
    document
  ) => {
    try {
      if (!document) {
        throw { message: "Documento não fornecido", statusCode: 400 };
      }

      const user = await prismaClient.user.findUnique({
        where: { document },
        include: {
          account: {
            include: {
              phones: true,
            }
          }
        },
      });

      if (!user) {
        throw { message: "Conta não encontrada", statusCode: 404 };
      }

      if (!user.status) {
        throw { message: "Conta não ativa", statusCode: 404 };
      }

      if (user.account[0].phones.length < 0) {
        throw { message: "Conta sem telefone", statusCode: 404 };
      }

      if (
        user.authCode === null ||
        (user.authCode &&
          user.expiresAt &&
          new Date() > user.expiresAt)
      ) {
        const { authCode, expiresAt } = generateCode();

        await prismaClient.user.update({
          where: { id: user.id },
          data: {
            authCode,
            expiresAt,
          },
        });
        const mail = new Mail()
        await mail.sendEmail({
          destination: user.email,
          subject: "Código de autenticação WebApp-Eazy",
          htmlContent: "Código de autenticação WebApp-Eazy: " + authCode,
        })
        // await whatsApiClient
        //   .post("/Whatsapp/Api", {
        //     code: user.phones[0].country_code,
        //     numero: user.phones[0].phone,
        //     text: "Código de autenticação WebApp-Eazy: " + authCode,
        //   })
        //   .then((response) => console.log("---"))
        //   .catch((err) => console.log(err));
      }

      return {
        name: user.name,
        document: user.document,
      };
    } catch (error) {
      console.log(error);
      throw {
        message: "Falhou pegar contas",
        statusCode: 500,
        details: error,
      };
    }
  };

  loginUserSecondStep: AppUserService.LoginUserSecondStep.Handler =
    async (authCode) => {
      try {
        const user = await prismaClient.user.findFirst({
          where: { authCode },
        });

        if (!user) {
          throw { message: "Conta não encontrada", statusCode: 404 };
        }

        if (user.expiresAt && new Date() > user.expiresAt) {
          throw { message: "Código expirado!", statusCode: 401 };
        }

        const token = sign({}, String(process.env.SECRET_KEY), {
          subject: String(user.id),
          expiresIn: "24h", // 12 hours
          algorithm: "HS512",
        });

        return {
          token,
          id: user.id,
          name: user.name,
          document: user.document,
        };
      } catch (error) {
        throw {
          message: "Falho etapa login!",
          statusCode: 500,
          details: error,
        };
      }
    };
}

export default UserService;
