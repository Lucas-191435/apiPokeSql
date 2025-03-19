import { Request, Response } from "express";
import CardService from "./card.service";
import { IError } from "../../types/generics";



class CardController {
    private cardService: CardService;

    constructor() {
        this.cardService = new CardService();
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;

            const card = await this.cardService.create({
                data
            });

            return res.status(201).json({ message: "Conta adicionada.", data: card });
        } catch (error) {
            const err = error as IError;
            return res.status(err.details.statusCode || 500).json({ message: err.message, details: err.details });
        }

    }

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const { page = 0, pageSize = 0, search = '' } = req.query
            let cards

            cards = await this.cardService.findAndCountAll({
                page: +page || 0,
                pageSize: +pageSize || 0,
                query: JSON.stringify({
                    search,
                })
            })

            return res.status(201).json({ message: "Contas", data: cards });
        } catch (error) {
            const err = error as IError;
            return res.status(err.details.statusCode || 500).json({ message: err.message, details: err.details });
        }
    }

    async cardById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.query

            let cards = await this.cardService.findById(id as string)

            return res.status(201).json({ message: "Contas", data: cards });
        } catch (error) {
            const err = error as IError;
            return res.status(err.details.statusCode || 500).json({ message: err.message, details: err.details });
        }
    }

    async cardsByAccount(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.query

            let cards = await this.cardService.cardsByAccount(id as string)

            return res.status(201).json({ message: "Contas", data: cards });
        } catch (error) {
            const err = error as IError;
            return res.status(err.details.statusCode || 500).json({ message: err.message, details: err.details });
        }
    }

    async unblock(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.query

            let cards = await this.cardService.cardsByAccount(id as string)

            return res.status(201).json({ message: "Contas", data: cards });
        } catch (error) {
            const err = error as IError;
            return res.status(err.details.statusCode || 500).json({ message: err.message, details: err.details });
        }
    }

    async activate(req: Request, res: Response): Promise<Response> {
        try {
            const { id, accountId } = req.params;
            const organizationId = '';
            const { cvv } = req.body;

            let cards = await this.cardService.activate(
                {
                    id,
                    organizationId,
                    accountId,
                    cvv
                }
            );

            return res.status(201).json({ message: "Contas", data: cards });
        } catch (error) {
            const err = error as IError;
            return res.status(err.details.statusCode || 500).json({ message: err.message, details: err.details });
        }
    }
}

export default CardController;