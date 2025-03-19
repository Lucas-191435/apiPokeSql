import { defaultProvider } from "@aws-sdk/credential-provider-node";
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";

type SendEmailParams = {
  destination: string;
  subject: string;
  htmlContent: string;
};

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: defaultProvider(),
});

class Mail {
  async sendEmail({ destination, subject, htmlContent }: SendEmailParams) {
    const sendEmailCommandInput: SendEmailCommandInput = {
      Source: "Digital Eazy <no-reply@digitaleazy.dev.br>",
      Destination: { ToAddresses: [destination] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: htmlContent } },
      },
    };

    try {
      const sendEmailCommand = new SendEmailCommand(sendEmailCommandInput);

      return sesClient.send(sendEmailCommand);
    } catch {
      return "Error sending e-mail.";
    }
  }
}

export { Mail };