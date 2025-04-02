import { Request, Response, Router } from "express";
// import AccountController from "./email.controller";
import { valideteAccountToken } from "../../middlewares/valideteAccountToken";
import { validateRequest } from "../../middlewares/validateRequest";
import EmailController from "./email.controller";



const routes = Router();
const emailController = new EmailController();

routes.get("/sendEmailTest", (req, res) => {
    console.log('Entrou')
    emailController.sendEmailTest(req, res);
})

export default routes;