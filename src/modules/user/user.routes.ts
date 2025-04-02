import { Request, Response, Router } from "express";
import AccountController from "./user.controller";
import { valideteAccountToken } from "../../middlewares/valideteAccountToken";
import { validateRequest } from "../../middlewares/validateRequest";
import multer from "multer"
import {
  createUserSchema,
} from "./user.schema";
import upload from "../../config/multerImgConfig";
interface MulterRequest extends Request {
  file?: Express.Multer.File
}

const routes = Router();

const userController = new AccountController();

// const upload = multer(multerConfig)
routes.post("/user", upload.array('avatarProfile',2), (req: Request, res: Response) =>
  { console.log(req.files);
    userController.create(req, res)}
);

routes.get("/user/:userId", (req: Request, res: Response) =>
  userController.getUser(req, res)
);

// routes.get(
//   "/userByToken",
//   valideteAccountToken,
//   (req: Request, res: Response) => userController.userByToken(req, res)
// );

// routes.post("/loginUserFistStep", (req: Request, res: Response) =>
//   userController.loginUserFistStep(req, res)
// );

// routes.post("/loginUserSecondStep", (req: Request, res: Response) =>
//   userController.loginUserSecondStep(req, res)
// );

export default routes;