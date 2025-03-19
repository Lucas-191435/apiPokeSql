import { Request, Response, Router, NextFunction } from 'express'
import CardController from './card.contoller'
import { valideteAccountToken } from "../../middlewares/valideteAccountToken";

import { validateRequest } from "../../middlewares/validateRequest";

import {
  createCardSchema,
} from "./card.schema";



const routes = Router()
const cardController = new CardController();

routes.post(
  '/card',
  // valideteAccountToken,
  validateRequest(createCardSchema),
  (req: Request, res: Response) => cardController.create(req, res),
)

routes.get(
  '/card',
  (req: Request, res: Response) => cardController.index(req, res),
)

routes.get(
  '/cardById',
  (req: Request, res: Response) => cardController.cardById(req, res),
)

routes.get(
  '/cardsByAccount',
  (req: Request, res: Response) => cardController.cardsByAccount(req, res),
)

routes.patch(
  "/cards/:id/accounts/:accountId/unblock",
  (req: Request, res: Response) => cardController.unblock(req, res)
);

routes.post(
  "/card/:id/account/:accountId/activate",
  (req: Request, res: Response) => cardController.activate(req, res)
);

export default routes;