import { Request, Response } from "express";
import AccountService from "./user.service";
import { IError } from "../../types/generics";
import { InferType } from 'yup';
import { resetPasswordSchema, validateTokenForResetPasswordSchema } from "./user.schema";

class AccountController {
  private userService: AccountService;
  constructor() {
    this.userService = new AccountService();
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const user = await this.userService.create({
        data,
        files: req.files,
      });

      return res
        .status(200)
        .json({ message: "Conta adicionada.", user });
      } catch (error) {
        const err = error as IError;
        return res
          .status(err.statusCode || 500)
          .json(error);
      }
  }


  async getUser(req: Request, res: Response): Promise<Response> {
    try {
      const {userId} = req.params;
      const user = await this.userService.getUser({
        userId
      });

      if ('statusCode' in user) {
        return res
          .status(user.statusCode || 500)
          .json({ message: user.message, details: user.details });
      }

      return res
        .status(200)
        .json({ message: "Conta encontrada.", data: {
          ...user,
          avatarUrl: `${process.env.APP_URL}/avatars/${user?.avatar}`
        } });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }


  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const {userId} = req.params;
      console.log("req.body", req.body);
      const user = await this.userService.updateUser({
        userId,
        data: req.body,
      });

      if ('statusCode' in user) {
        return res
          .status(user.statusCode || 500)
          .json({ message: user.message, details: user.details });
      }

      return res
        .status(200)
        .json({ message: "Conta encontrada.", data: {
          ...user,
          avatarUrl: `${process.env.APP_URL}/avatars/${user?.avatar}`
        } });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const {userId} = req.params;
      const user = await this.userService.deleteUser({
        userId
      });

      if ('statusCode' in user) {
        return res
          .status(user.statusCode || 500)
          .json({ message: user.message, details: user.details });
      }

      return res
        .status(200)
        .json({ message: "deletada encontrada.", data: {
          ...user,
          avatarUrl: `${process.env.APP_URL}/avatars/${user?.avatar}`
        } });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
     
      console.log("req.body aaa", req.body);
      // console.log('req.file',req.file);
      const {email,
        password} = req.body;
      const data = await this.userService.login({
        email,
        password
      });

      if (data && 'statusCode' in data) {
        return res
          .status(data.statusCode || 500)
          .json({ message: data.message, details: data.details });
      }

      return res
        .status(200)
        .json({ message: "Conta encontrada.", token: data?.token, data: {
          ...data?.user,
          avatarUrl: ``
          // avatarUrl: `${process.env.APP_URL}/avatars/${JSON.parse(data?.user?.avatar ?? '')[0]}`
        } });
    } catch (error) {
      const err = error as IError;
      console.log("error", error);
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const {email} = req.body as InferType<typeof resetPasswordSchema>;

      const data = await this.userService.resetPassword({
        email
      });

      return res
        .status(200)
        .json({ message: "Reset password enviado.", data});
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }


  async validateTokenForResetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body as InferType<typeof validateTokenForResetPasswordSchema>;

      const data = await this.userService.validateTokenForResetPassword(body);

      return res
        .status(200)
        .json({ message: "Senha alterada"});
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }
}

export default AccountController;
