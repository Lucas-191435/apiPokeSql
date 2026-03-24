import { Request, Response, Router } from "express";
import { valideteUserToken } from "../../middlewares/valideteUserToken";
import { validateRequest } from "../../middlewares/validateRequest";

const routes = Router();
import ItemController from "./items.controller";
import { asyncHandler } from "../../utils/asyncHandler";
const itemController = new ItemController();

routes.get("/items",
    valideteUserToken,
    asyncHandler(async (req) => {
        return await itemController.getItems(req.query as any);
    })
);

export default routes;