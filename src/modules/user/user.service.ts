import { Prisma } from "@prisma/client";
import prismaClient from "../../database/index";
import { AppUserService } from "../../interfaces/IUserService";
import axios from "axios";
import { JsonWebTokenError, sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { generateCode } from "../../utils/helpers";
import { Mail } from "../../utils/Mail";

JsonWebTokenError;
class UserService implements AppUserService.IUserService {
  create: AppUserService.Create.Handler = async ({ data }) => {
    try {
      console.log(data.email);
      if (!data.email) {
        throw {
          message: "Email não foi enviado ou é inválido!",
          statusCode: 400,
        };
      }
      
      const userAlreadyExists = await prismaClient.user.findFirst({
        where: { email: data.email },
      });

      console.log(userAlreadyExists)
      if (userAlreadyExists) {
        throw {
          message: "Já existe um usuário com esse email!",
          statusCode: 409,
        };
      }

      const user = await prismaClient.user.create({
        data: data
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



}

export default UserService;
