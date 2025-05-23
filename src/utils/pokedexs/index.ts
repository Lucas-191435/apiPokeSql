import sinnohPokemon from "./sinnoh";

const pokedex = {
    kanto: [],
    johto: [],
    hoenn: [],
    sinnoh: sinnohPokemon,
    unova: [],
};

export default pokedex;
export type Pokedex = typeof pokedex;