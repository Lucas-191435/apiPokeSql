import { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";
import path from "path";

const dir = path.resolve("src", "views");

export const handlebarOptions: NodemailerExpressHandlebarsOptions = {
    viewEngine: {
        extname: ".handlebars",
        layoutsDir: dir,
        partialsDir: dir,
        defaultLayout: false,
    },
    viewPath: dir,
    extName: ".handlebars",
    // helpers: {
    //     formatDate: (date: Date) => date.toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" }),
    // },
}