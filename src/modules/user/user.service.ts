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

      throw {
        message: "Falhou ao criar a conta!",
        statusCode: 500,
        details: 'error',
      };
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
