import * as yup from "yup";
import { cpf, cnpj } from "cpf-cnpj-validator";

const createUserSchema = yup.object().shape({
    name: yup
      .string()
      .required("Nome é um campo obrigatório.")
      .min(3, "O nome deve possuir no mínimo 3 caracteres.")
      .max(60, "O nome deve possuir no máximo 60 caracteres."),

    email: yup
      .string().email('Verifique o email')
      .required("Nome é um campo obrigatório.")
      .min(3, "O nome deve possuir no mínimo 3 caracteres.")
      .max(60, "O nome deve possuir no máximo 60 caracteres."),
  
    document: yup
      .string()
      .required("document é um campo obrigatório.")
      .min(11, "O documento deve possuir no mínimo 11 caracteres.")
      .max(14, "O documento deve possuir no máximo 14 caracteres.")
      .matches(/^[0-9]+$/, "O documento deve conter apenas números.")
      .test(
        "valid-cpf-cnpj",
        "O documento deve ser um CPF ou CNPJ válido.",
        (value: any) => cpf.isValid(value) || cnpj.isValid(value)
      ),
  });

  export {
    createUserSchema,
  };
  