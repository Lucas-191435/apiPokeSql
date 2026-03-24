import { Prisma, Pokemon, Region } from "@prisma/client";
import { IError } from "../../types/generics";
import prismaClient from "../../database";
import { transformPokemonData } from "../../utils/utils";

import { AppItemsService } from "./types/IItemsService";



class ItemService implements AppItemsService.IItemService {
    getItems: AppItemsService.GetAllItems.Handler = async ({ page, pageSize, query, pokeItemPocketId }) => {
        try {
            console.log("Fetching items with query:", query, "page:", page, "pageSize:", pageSize, "pokeItemPocketId:", pokeItemPocketId);
            const conditions: Array<Record<string, any>> = [];

            if (query) {
                conditions.push({
                    OR: [
                        {
                            name: {
                                contains: `${query}`,
                            }
                        },
                    ],
                });
            }

            if (pokeItemPocketId) {
                conditions.push({
                    pokeItemPocketId: pokeItemPocketId,
                });
            }

             const where: Prisma.ItemFindManyArgs["where"] = {
                AND: conditions.length > 0 ? conditions : undefined,
            };

            const items = await prismaClient.item.findMany({
                where,
                orderBy: {
                    pokeItemId: 'asc',
                },
                skip: ((page ?? 1) - 1) * (pageSize ?? 20),
                take: pageSize ?? 20,
            });

            const itemsCount = await prismaClient.item.count({
                where,
            });

            return {
                count: itemsCount,
                rows: items, 
            };
        } catch (error) {
            console.error("Error fetching items:", error);
            throw error;
        }
    }

    createManyItems: AppItemsService.CreateManyItems.Handler = async (items) => {
        try {
            console.log("Creating items:", items.length, "items");

            const createdItems = await prismaClient.item.createMany({
                data: items,
                skipDuplicates: true, // Evita erro se item já existir
            });

            console.log("Successfully created", createdItems.count, "items");

        } catch (error) {
            console.error("Error creating items:", error);
            throw error;
        }
    }
}

export default ItemService;