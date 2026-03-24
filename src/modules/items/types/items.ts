import { ItemCategory } from '@prisma/client';

interface Item {
  id: string;  // Alterado de number para string (UUID)
  pokeItemId: number;
  pokeCategoryId: number | null;
  pokeItemPocketId: number | null;
  name: string;
  sprite: string | null;
  category: ItemCategory | null;  // Usando enum do Prisma
  description: string | null;
  effect: string | null;
  isConsumable: boolean;
  isHeldItem: boolean;
  isBattleUse: boolean;
  isDiscardable: boolean;
  isPokemonUse: boolean;
  price: number | null;
  regions: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ItemWithoutId = Omit<Item, "id" | "createdAt" | "updatedAt">;

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
