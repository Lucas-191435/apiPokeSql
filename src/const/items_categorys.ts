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


const ITEM_CATEGORY_GROUPS = {
    pokeballs: [33, 34, 39],

    healing: [3, 27, 29, 30, 6, 5],

    pp_recovery: [28],

    battle_items: [1, 2, 14, 26, 16,
        // 50
    ],

    held_items: [12, 13, 15, 17, 18, 19, 36,
        // 45
    ],

    evolution: [10,
        // 44, 
        // 46, 
        // 49, 
        // 52
    ],

    berries_food: [8, 32,
        // 51, 53, 55
    ],

    machines: [37,
        // 54
    ],

    collectibles: [9, 24, 42],

    key_items: [20, 21, 22, 35, 38,
        // 41
    ],

    mail: [25],

    crafting: [40,
        // 47
    ],

    special_mechanics: [43,
        // 48
    ],

    fossils_and_mining: [11],

    misc: [4, 23, 31] // (31 não veio na lista mas existe em algumas versões)
}