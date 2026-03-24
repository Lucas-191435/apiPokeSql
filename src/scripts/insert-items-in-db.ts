import ItemsPokeAPI from "../modules/items/itemsPokeApi.service";

//  npx ts-node src/scripts/insert-items-in-db.ts

const runScript = async () => {
    const itemsService = new ItemsPokeAPI();
    try {
    console.log("Fetching item categories...");
    const categories = await itemsService.getItemCategory();
    console.log("Item categories fetched:", categories);


    } catch (error) {
        console.error("Error running script:", error);
    }
}

runScript();