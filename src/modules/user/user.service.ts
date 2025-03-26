import { Prisma } from "@prisma/client";
import prismaClient from "../../database/index";
import { AppUserService } from "../../interfaces/IUserService";
import { JsonWebTokenError, sign } from "jsonwebtoken";
import {  saveImages } from "../../utils/saveImg";

JsonWebTokenError;
class UserService implements AppUserService.IUserService {
  create: AppUserService.Create.Handler = async ({ data, files }) => {
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


      // Só salva a imagem se o usuário foi criado com sucesso
      if (files && files.length > 0) {
        console.log('Entrou pra criar com múltiplos arquivos')
  
        const fileNames = await saveImages(files, user.id)
  
        const updatedUser = await prismaClient.user.update({
          where: { id: user.id },
          data: { avatar: JSON.stringify(fileNames) } // Salvando como JSON no banco
        })
  
        return updatedUser
      }

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

  getUser: AppUserService.getUser.Handler = async ({ userId }) => {
    try {
      const user = await prismaClient.user.findFirst({
        where: { id: userId },
      })

      if (!user) {
        throw {
          message: "Usuario não encontrado",
          statusCode: 404,
        };
      }

      return user
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
        message: "Falhou ao encontrar a conta!",
        statusCode: 500,
        details: error,
      };
    }
  };
}

export default UserService;
