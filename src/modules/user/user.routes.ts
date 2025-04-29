import { Request, Response, Router } from "express";
import AccountController from "./user.controller";
import { valideteUserToken } from "../../middlewares/valideteUserToken";
import { validateRequest } from "../../middlewares/validateRequest";
import multer from "multer"
import {
  createUserSchema,
} from "./user.schema";
import multerConfig from "../../config/multerConfig";
import upload from "../../config/multerImgConfig";
interface MulterRequest extends Request {
  file?: Express.Multer.File
}

const routes = Router();

const userController = new AccountController();

const router = Router()
// const upload = multer(multerConfig)
routes.post("/user", upload.array('avatarProfile',2), (req: Request, res: Response) =>
  { console.log(req.files);
    userController.create(req, res)}
);

routes.post("/user/login", (req: Request, res: Response) =>
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

export default routes;