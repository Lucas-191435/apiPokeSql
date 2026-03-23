
interface Item {
  id: number;
  name: string;
  sprite: string;
  category: string;
  description: string;
  effect: string;
  isConsumable: boolean;
  isHeldItem: boolean;
  isBattleUse: boolean;
  isDiscardable: boolean;
  isPokemonUse: boolean;
  price: number;
}

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
