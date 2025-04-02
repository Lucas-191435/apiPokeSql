import { Request, Response } from "express";
import AccountService from "./user.service";
import { IError } from "../../types/generics";
;

class AccountController {
  private userService: AccountService;
  constructor() {
    this.userService = new AccountService();
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
     
      // console.log(req.body);
      console.log('req.file',req.files);
      const data = req.body;
      const user = await this.userService.create({
        data,
        files: req.files,
      });

      return res
        .status(200)
        .json({ message: "Conta adicionada.", data: user });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
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
}

export default AccountController;
