import { HBSCtx } from './../../types/HandlebarsContexts';
import { Request, Response } from "express";
// import AccountService from "./email.service";
import { IError } from "../../types/generics";
import { MailProvider } from "../../provider/Mail.Provider";
;


class EmailController {
    async sendEmailTest(req: Request, res: Response): Promise<Response>{
        try {
            const { body } = req;
            console.log(body);

            const mailer = new MailProvider();
            
            const recoverContext: HBSCtx.testEmail = {
                name: "TesteEmail",
              };

            mailer.sendEmail({
                to: 'lucasfernandosantos2001@gmail.com',
                subject: "Recuperação de senha",
                context: recoverContext,
                template: "testEmail",
              });

            // await emailService.sendEmail(body.to, body.subject, body.message);
            return res.status(200).json({ message: "Email enviado com sucesso!" });
        } catch (error) {
            return res.status(500).json({ message: "Ocorreu um erro ao enviar o email.", error });
        }
    }
}

export default EmailController;