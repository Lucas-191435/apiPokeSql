type ItemCategory = 
  'pokeballs' | 
  'healing' |
  'pp_recovery' |
  'battle_items' |
  'held_items' |
  'evolution' |
  'berries_food' |
  'machines' |
  'collectibles' |
  'key_items' |
  'mail' |
  'crafting' |
  'special_mechanics' |
  'fossils_and_mining' ;

interface Item {
  id: number;
  pokeItemId: number;
  pokeCategoryId: number | null;
  name: string;
  sprite: string;
  category: ItemCategory | null;
  description: string;
  effect: string;
  isConsumable: boolean;
  isHeldItem: boolean;
  isBattleUse: boolean;
  isDiscardable: boolean;
  isPokemonUse: boolean;
  price: number;
}

export type ItemWithoutId = Omit<Item, "id">;

// const a = {
//   id: 1,
//   name: 'Potion',
//   sprite:
//     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',
//   category: 'medicina',
//   description:
//     'Um spray medicinal para tratar ferimentos. Restaura a vida de um Pokémon em 20 pontos.',
//   effect: 'Restaura 20 HP',
//   isConsumable: true,
//   isHeldItem: false,
//   isBattleUse: true,
//   isDiscardable: true,
//   isPokemonUse: true,
//   price: 200,
// };
