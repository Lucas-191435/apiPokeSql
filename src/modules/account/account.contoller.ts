import { Request, Response } from "express";
import AccountService from "./account.service";
import { IError } from "../../types/generics";
import { EazyService } from "../eazy/eazy.service";
class AccountController {
  private accountService: AccountService;
  private eazyClient: EazyService;
  constructor() {
    this.accountService = new AccountService();
    this.eazyClient = new EazyService();
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const account = await this.accountService.create({
        data,
      });

      return res
        .status(201)
        .json({ message: "Conta adicionada.", data: account });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const { page = 0, pageSize = 0, search = "" } = req.query;
      let accounts;

      accounts = await this.accountService.findAndCountAll({
        page: +page || 0,
        pageSize: +pageSize || 0,
        query: JSON.stringify({
          search,
        }),
      });

      return res.status(201).json({ message: "Contas", data: accounts });
    } catch (error) {
      const err = error as IError;
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message, details: err.details });
    }
  }

  async accountByDocument(req: Request, res: Response): Promise<Response> {
    try {
      const { document } = req.query;

      let accounts = await this.accountService.findByDocument(
        document as string
      );

      return res.status(201).json({ message: "Contas", data: accounts });
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
