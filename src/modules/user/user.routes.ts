import { Request, Response, Router } from "express";
import AccountController from "./user.controller";
import { valideteAccountToken } from "../../middlewares/valideteAccountToken";
import { validateRequest } from "../../middlewares/validateRequest";

import {
  createUserSchema,
} from "./user.schema";


const routes = Router();

const userController = new AccountController();

routes.post("/user", (req: Request, res: Response) =>
  userController.create(req, res)
);

routes.get(
  "/userByToken",
  valideteAccountToken,
  (req: Request, res: Response) => userController.userByToken(req, res)
);

routes.post("/loginUserFistStep", (req: Request, res: Response) =>
  userController.loginUserFistStep(req, res)
);

routes.post("/loginUserSecondStep", (req: Request, res: Response) =>
  userController.loginUserSecondStep(req, res)
);

export default routes;