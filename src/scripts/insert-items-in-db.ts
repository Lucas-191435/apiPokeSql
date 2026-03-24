import { ITEM_CATEGORY_GROUPS, mapItemAttributes, mapCategoryToEnum } from "../const/items_categorys";
import ItemsPokeAPI from "../modules/items/itemsPokeApi.service";
import ItemsService from "../modules/items/items.service";

//  npx ts-node src/scripts/insert-items-in-db.ts
const VERSION_TO_REGION: Record<string, string> = {
  // Kanto
  "red-blue": "kanto",
  "yellow": "kanto",
  "firered-leafgreen": "kanto",

  // Johto
  "gold-silver": "johto",
  "crystal": "johto",
  "heartgold-soulsilver": "johto",

  // Hoenn
  "ruby-sapphire": "hoenn",
  "emerald": "hoenn",
  "omega-ruby-alpha-sapphire": "hoenn",

  // Sinnoh
  "diamond-pearl": "sinnoh",
  "platinum": "sinnoh",
  "brilliant-diamond-shining-pearl": "sinnoh",

  // Unova
  "black-white": "unova",
  "black-2-white-2": "unova",

  // Kalos
  "x-y": "kalos",

  // Alola
  "sun-moon": "alola",
  "ultra-sun-ultra-moon": "alola",

  // Galar
  "sword-shield": "galar",

  // Paldea
  "scarlet-violet": "paldea",
};

function getItemRegions(itemData: any): string {
  const regions = new Set<string>();

  itemData.flavor_text_entries?.forEach((entry: any) => {
    const vg = entry.version_group?.name;
    const region = VERSION_TO_REGION[vg];

    if (region) {
      regions.add(region);
    }
  });

  return Array.from(regions).toString();
}

const runScript = async () => {
    const itemsPokeApiService = new ItemsPokeAPI();
    const itemsService = new ItemsService();
    try {

        for (const group of ITEM_CATEGORY_GROUPS) {
            console.log(`Group: ${group.name}`);
            for (const categoryId of group.itemCategories) {
                const category = await itemsPokeApiService.findItemCategory(categoryId);
                if(category.id === 10) console.log(`  Category ID: ${categoryId}, Name: ${category.name}`, category.items);

                const mappedItemsIds: number[] = category.items.map(item => {
                    const id = parseInt(item.url.split("/").slice(-2, -1)[0]);
                    return id;
                })

                if(category.id === 10) console.log(`  Mapped Item IDs for Category ID ${categoryId}:`, mappedItemsIds);

                const dataItems = await Promise.all(mappedItemsIds.map(async (itemId) => {
                    const itemData = await itemsPokeApiService.findItem(itemId);
                    return {
                        pokeItemId: itemData.id,
                        pokeCategoryId: category.id,
                        pokeItemPocketId: group.id,
                        name: itemData.name,
                        sprite: itemData.sprites?.default || null,
                        category: mapCategoryToEnum(category.name, category.id),
                        description: itemData.effect_entries.find((entry) => entry.language.name === "en")?.short_effect || "",
                        effect: itemData.effect_entries.find((entry) => entry.language.name === "en")?.effect || "",
                        ...mapItemAttributes(category.id, itemData.attributes.map(attr => attr.name)),
                        price: itemData.cost,
                        regions: getItemRegions(itemData),
                    }
                }));

                const filteredDataItems = dataItems.filter(item => item.regions !== "" && item.description !== "" && item.effect !== "");

                if(category.id === 10) console.log(`  Data for Items in Category ID ${categoryId}:`, filteredDataItems);

                await itemsService.createManyItems(filteredDataItems);
            }
        }

    } catch (error) {
        console.error("Error running script:", error);
    }
}

runScript();