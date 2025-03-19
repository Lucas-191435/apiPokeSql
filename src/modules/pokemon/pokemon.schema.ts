import * as yup from "yup";

const PokemonSchema = yup.object().shape({
    name: yup
      .string()
      .required("Nome é um campo obrigatório.")
      .min(3, "O nome do cartão (apelido) deve possuir no mínimo 3 caracteres.")
      .max(
        50,
        "O nome do cartão (apelido) deve possuir no máximo 50 caracteres."
      ),
  
    printed_name: yup
      .string()
      .optional()
      .min(2, "O nome impresso no cartão deve possuir no mínimo 2 caracteres.")
      .max(26, "O nome impresso no cartão deve possuir no máximo 26 caracteres.")
      .matches(
        /^[a-zA-Z\s]*$/,
        "O nome impresso no cartão não pode conter acentuação."
      ),
  
    transaction_limit: yup.number().optional(),
  
    type: yup
      .string()
      .required("Type é um campo obrigatório.")
      .oneOf(
        ["PLASTIC", "VIRTUAL"],
        "O tipo de cartão deve ser um dos seguintes valores: PLASTIC ou VIRTUAL"
      )
      .default("PLASTIC"),
  
    accountId: yup.string().required("accountId é um campo obrigatório."),
  
    customerId: yup.string().required("customerId é um campo obrigatório."),
  });

  export {
    PokemonSchema,
  };
  