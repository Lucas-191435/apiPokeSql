import * as yup from 'yup';
import { validate as validateUUID } from 'uuid';

const updatePokemonMovesSchema = yup.object({
    myPokemonId: yup
        .string()
        .required("myPokemonId é obrigatório")
        .test('is-uuid', 'myPokemonId deve ser um UUID válido', value => 
            value ? validateUUID(value) : false
        ),
    team: yup
        .string()
        .required("Team é obrigatório")
        .oneOf(['teamAlpha', 'teamBeta', 'teamGamma'], "Team deve ser 'teamAlpha', 'teamBeta' ou 'teamGamma'"),
    moves: yup
        .array()
        .of(yup.string())
        .max(4, "Um pokemon não pode ter mais de 4 movimentos")
        .test('all-uuids', 'Todos os movimentos devem ser UUIDs válidos', function(value) {
            if (!value || value.length === 0) return true;

            const invalidMoves = value.filter(move => {
                if (!move) return true; // Considera valores vazios como inválidos
                return !validateUUID(move);
            });
            if (invalidMoves.length > 0) {
                return this.createError({
                    message: `Os seguintes movimentos não são UUIDs válidos: ${invalidMoves.join(', ')}`
                });
            }
            return true;
        })
});

export { updatePokemonMovesSchema };