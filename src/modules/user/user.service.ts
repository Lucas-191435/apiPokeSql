import { Prisma, User } from "@prisma/client";
import prismaClient from "../../database/index";
import { AppUserService } from "../../interfaces/IUserService";
import { JsonWebTokenError, sign } from "jsonwebtoken";
import { saveImages } from "../../utils/saveImg";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import authConfig from "../../config/authConfig";
JsonWebTokenError;
class UserService implements AppUserService.IUserService {
  create: AppUserService.Create.Handler = async ({ data, files }) => {
    try {
      if (!data.email) {
        throw {
          message: "Email não foi enviado ou é inválido!",
          statusCode: 400,
        };
      }

      const userAlreadyExists = await prismaClient.user.findFirst({
        where: { email: data.email },
      });

      if (userAlreadyExists) {
        throw {
          message: "Já existe um usuário com esse email!",
          statusCode: 409,
        };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10)

      const user = await prismaClient.user.create({
        data: {
          ...data,
          password: hashedPassword
        }
      });


      // Só salva a imagem se o usuário foi criado com sucesso
      if (files && files.length > 0) {

        const fileNames = await saveImages(files, user.id)

        const updatedUser = await prismaClient.user.update({
          where: { id: user.id },
          data: { avatar: JSON.stringify(fileNames) } // Salvando como JSON no banco
        })

        return {
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
        }
      }

      return {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
      };
    } catch (error) {
      console.error(error);
      throw error;
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


  updateUser: AppUserService.updateUser.Handler = async ({ data, userId }) => {
    try {
      const existingUser = await prismaClient.user.findUnique({
        where: { id: userId },
      })

      if(!existingUser) {
        throw {
          message: "Usuario não encontrado",
          statusCode: 404,
        };
      }

      const updateData = { ...data }

      if (data.password) {
        const isSamePassword = await bcrypt.compare(data.password, existingUser.password ?? '')
        if(!isSamePassword) {
          const hashedPassword = await bcrypt.hash(data.password, 10)
          updateData.password = hashedPassword
        }else{
          delete updateData.password
        }
      }
      const user = await prismaClient.user.update({
        where: { id: userId },
        data: {
          ...updateData,
        },
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

  deleteUser: AppUserService.deleteUser.Handler = async ({ userId }) => {
    try {
      const user = await prismaClient.user.delete({
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


  login: AppUserService.Login.Handler = async ({ email, password }) => {
    try {
      const user = await prismaClient.user.findFirst({
        where: { email: email },
      })

      if (!user) {
        throw {
          message: "Usuario não encontrado",
          statusCode: 404,
        };
      }

      const valid = await bcrypt.compare(password, user.password || '')
      if (!valid) {
        throw {
          message: "Senha invalida",
          statusCode: 409,
        };
      }

      const token = sign({ id: user.id }, String(authConfig.secret), { expiresIn: '64h', algorithm: "HS512", })

      return {
        user: {
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          name: user.name,
          role: user.role,
        }, 
        token: token
      }
    } catch (error) {
      throw error;
    }
  };

  resetPassword: AppUserService.ResetPassword.Handler = async ({ email }) => {
    try {
      const user = await prismaClient.user.findFirst({
        where: { email: email },
      })

      if (!user) {
        throw {
          message: "Usuario não encontrado",
          statusCode: 404,
        };
      }
     
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min


      await prismaClient.user.update({
        where: { email },
        data: {
          resetToken: token,
          resetTokenExpiry: expires,
        },
      });

      return token
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
      
      }
      throw {
        message: "Falhou ao enviar email!",
        statusCode: 500,
        details: error,
      };
    }
  };

  validateTokenForResetPassword: AppUserService.ValidateTokenForResetPassword.Handler = async ({ password, token }) => {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gte: new Date(),
          },
        },
      })

      if(!user){
        throw {
          message: "Token inválido ou expirado",
          statusCode: 400,
        }
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);

      await prismaClient.user.update({
        where: {id: user.id},
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        }
      })
      return token
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
      
      }
      throw {
        message: "Falhou ao enviar email!",
        statusCode: 500,
        details: error,
      };
    }
  };
}

export default UserService;
