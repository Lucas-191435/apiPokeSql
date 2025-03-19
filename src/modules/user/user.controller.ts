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
      const data = req.body;
      const user = await this.userService.create({
        data,
      });

      return res
        .status(201)
        .json({ message: "Conta adicionada.", data: user });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }
}

export default AccountController;
