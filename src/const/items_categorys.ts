export const itemCategories = [
    { id: 1, name: "stat-boosts" },
    { id: 2, name: "effort-drop" },
    { id: 3, name: "medicine" },
    { id: 4, name: "other" },
    { id: 5, name: "in-a-pinch" },
    { id: 6, name: "picky-healing" },
    { id: 7, name: "type-protection" },
    { id: 8, name: "baking-only" },
    { id: 9, name: "collectibles" },
    { id: 10, name: "evolution" },
    { id: 11, name: "spelunking" },
    { id: 12, name: "held-items" },
    { id: 13, name: "choice" },
    { id: 14, name: "effort-training" },
    { id: 15, name: "bad-held-items" },
    { id: 16, name: "training" },
    { id: 17, name: "plates" },
    { id: 18, name: "species-specific" },
    { id: 19, name: "type-enhancement" },
    { id: 20, name: "event-items" },
    { id: 21, name: "gameplay" },
    { id: 22, name: "plot-advancement" },
    { id: 23, name: "unused" },
    { id: 24, name: "loot" },
    { id: 25, name: "all-mail" },
    { id: 26, name: "vitamins" },
    { id: 27, name: "healing" },
    { id: 28, name: "pp-recovery" },
    { id: 29, name: "revival" },
    { id: 30, name: "status-cures" },
    { id: 32, name: "mulch" },
    { id: 33, name: "special-balls" },
    { id: 34, name: "standard-balls" },
    { id: 35, name: "dex-completion" },
    { id: 36, name: "scarves" },
    { id: 37, name: "all-machines" },
    { id: 38, name: "flutes" },
    { id: 39, name: "apricorn-balls" },
    { id: 40, name: "apricorn-box" },
    { id: 41, name: "data-cards" },
    { id: 42, name: "jewels" },
    { id: 43, name: "miracle-shooter" },

    // CATEGORIAS ADICIONADAS APÓS A GEN 5
    //   { id: 44, name: "mega-stones" },
    //   { id: 45, name: "memories" },
    //   { id: 46, name: "z-crystals" },
    //   { id: 47, name: "species-candies" },
    //   { id: 48, name: "catching-bonus" },
    //   { id: 49, name: "dynamax-crystals" },
    //   { id: 50, name: "nature-mints" },
    //   { id: 51, name: "curry-ingredients" },
    //   { id: 52, name: "tera-shard" },
    //   { id: 53, name: "sandwich-ingredients" },
    //   { id: 54, name: "tm-materials" },
    //   { id: 55, name: "picnic" },
];


export const ITEM_CATEGORY_GROUPS = [
    {
        id: 1,
        name: "misc",
        itemCategories: [
            9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 24, 32, 35, 36, 42
        ]
    },
    {
        id: 2,
        name: "medicine",
        itemCategories: [
            26, 27, 28, 29, 30,
        ]
    },
    {
        id: 3,
        name: "pokeballs",
        itemCategories: [
            33, 34, 39
        ]
    },

    {
        id: 4,
        name: "machines",
        itemCategories: [
            37
        ]
    },

    {
        id: 5,
        name: "berries",
        itemCategories: [
            2, 3, 4, 5, 6, 7, 8, 48
        ]
    },

    {
        id: 6,
        name: "mail",
        itemCategories: [
            25
        ]
    },
    {
        id: 7,
        name: "battle",
        itemCategories: [
            1, 38, 43
        ]
    },
    {
        id: 8,
        name: "key",
        itemCategories: [
            20, 21, 22, 23, 40, 41
        ]
    },
];


export function mapCategoryToEnum(categoryName: string, categoryId: number): string | null {
  // Mapeia nomes das categorias da PokéAPI para valores do enum ItemCategory
  const categoryMapping: Record<string, string> = {
    // Pokeballs
    "special-balls": "pokeballs",
    "standard-balls": "pokeballs",
    "apricorn-balls": "pokeballs",
    
    // Healing
    "healing": "healing", 
    "medicine": "healing",
    "revival": "healing",
    "status-cures": "healing",
    "vitamins": "healing",
    "in-a-pinch": "healing",
    "picky-healing": "healing",
    
    // PP Recovery
    "pp-recovery": "pp_recovery",
    
    // Battle items
    "stat-boosts": "battle_items",
    "type-protection": "battle_items",
    "choice": "battle_items",
    "effort-training": "battle_items",
    "training": "battle_items",
    "flutes": "battle_items",
    "miracle-shooter": "battle_items",
    
    // Held items
    "held-items": "held_items",
    "bad-held-items": "held_items",
    "plates": "held_items",
    "species-specific": "held_items",
    "type-enhancement": "held_items",
    "scarves": "held_items",
    "jewels": "held_items",
    
    // Evolution
    "evolution": "evolution",
    
    // Berries/Food
    "effort-drop": "berries_food",
    "baking-only": "berries_food",
    "catching-bonus": "berries_food",
    "mulch": "berries_food",
    "nature-mints": "berries_food",
    "curry-ingredients": "berries_food",
    "sandwich-ingredients": "berries_food",
    "picnic": "berries_food",
    
    // Machines
    "all-machines": "machines",
    "tm-materials": "machines",
    
    // Collectibles
    "collectibles": "collectibles",
    "loot": "collectibles",
    "dex-completion": "collectibles",
    
    // Key items
    "event-items": "key_items",
    "gameplay": "key_items",
    "plot-advancement": "key_items",
    "unused": "key_items",
    "apricorn-box": "key_items",
    "data-cards": "key_items",
    "z-crystals": "key_items",
    "other": "key_items",
    
    // Mail
    "all-mail": "mail",
    
    // Special mechanics (categorias avançadas)
    "mega-stones": "special_mechanics",
    "memories": "special_mechanics",
    "species-candies": "special_mechanics",
    "dynamax-crystals": "special_mechanics",
    "tera-shard": "special_mechanics",
    
    // Fossils and mining
    "spelunking": "fossils_and_mining"
  };
  
  return categoryMapping[categoryName] || null;
}

export function mapItemAttributes(categoryId: number, attributes: string[]) {
  const isPokemonUse = [
    1, 2, 3, 14, 16,
    26, 27, 28, 29, 30,
    50
  ].includes(categoryId);

  const isConsumable = [
    1, 2, 3, 10, 14, 16,
    26, 27, 28, 29, 30,
    50,
    33, 34, 39
  ].includes(categoryId);

  const isHeldItem =
    [
      12, 13, 15, 17, 18, 19,
      36, 42, 44, 45, 46
    ].includes(categoryId) ||
    attributes.includes("holdable");

  const isBattleUse =
    attributes.includes("usable-in-battle");

  const isDiscardable =
    ![
      20, 21, 22, 25, 35, 40, 41
    ].includes(categoryId);

  return {
    isConsumable,
    isHeldItem,
    isBattleUse,
    isDiscardable,
    isPokemonUse
  };
}