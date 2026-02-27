import { Request, Response, Router } from "express";
import AccountController from "./user.controller";
import { valideteUserToken } from "../../middlewares/valideteUserToken";
import { validateRequest } from "../../middlewares/validateRequest";
import multer from "multer"
import {
  createUserSchema,
  resetPasswordSchema,
  validateTokenForResetPasswordSchema,
} from "./user.schema";
import multerConfig from "../../config/multerConfig";
import upload from "../../config/multerImgConfig";
interface MulterRequest extends Request {
  file?: Express.Multer.File
}

const routes = Router();

const userController = new AccountController();

routes.post("/user", upload.array('avatarProfile',2), (req: Request, res: Response) =>
    userController.create(req, res)
);

routes.post("/auth/login", (req: Request, res: Response) =>
    userController.login(req, res)
);

routes.get("/user/:userId", valideteUserToken, (req: Request, res: Response) =>
  userController.getUser(req, res)
);

routes.put("/user/:userId", valideteUserToken, (req: Request, res: Response) =>
  userController.updateUser(req, res)
);

routes.delete("/user/:userId", valideteUserToken, (req: Request, res: Response) =>
  userController.deleteUser(req, res)
);

routes.post("/auth/resetPassword", validateRequest(resetPasswordSchema), (req: Request, res: Response) =>
  userController.resetPassword(req, res)
);

routes.post("/auth/validateTokenForResetPassword", validateRequest(validateTokenForResetPasswordSchema), (req: Request, res: Response) =>
  userController.validateTokenForResetPassword(req, res)
);

export default routes;