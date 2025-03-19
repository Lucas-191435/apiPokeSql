import { Request, Response } from "express";
import AccountService from "./user.service";
import { IError } from "../../types/generics";
import { EazyService } from "../eazy/eazy.service";

class AccountController {
  private userService: AccountService;
  private eazyClient: EazyService;
  constructor() {
    this.userService = new AccountService();
    this.eazyClient = new EazyService();
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

  async userByToken(req: Request, res: any): Promise<Response> {
    try {
      const userId = res.user;

      let users = await this.userService.findByToken(userId as string);

      return res.status(201).json({ message: "Contas", data: users });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }

  async loginUserFistStep(req: Request, res: Response): Promise<Response> {
    try {
      const { document } = req.body;

      let users = await this.userService.loginUserFistStep(
        document as string
      );

      return res.status(201).json({ message: "Conta", data: users });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }

  async loginUserSecondStep(req: Request, res: Response): Promise<Response> {
    try {
      const { authCode } = req.body;

      let users = await this.userService.loginUserSecondStep(
        authCode as string
      );

      return res.status(201).json({ message: "Conta", data: users });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }

  async testeInteracao(req: Request, res: Response): Promise<any> {
    try {
 
      const data = req.body;
      console.log("testeInteracao",data)
      const { account } = await this.eazyClient.createAccount({
        document: data.cpf,
        dueDateId: data.due_date_id,
        limit: data.limit,
        name: data.name,
      });

      return res.status(201).json({ message: "Conta", data: account });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }
}

export default AccountController;
