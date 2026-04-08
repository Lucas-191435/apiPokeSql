// import ItemService from "./items.service";

// class ItemsController {
//     private itemService: ItemService;
//     constructor() {
//         this.itemService = new ItemService();
//     }

//     async getItems(params: {
//         page: string;
//         pageSize: string;
//         query?: string;
//         categoryId?: string;
//     }) {
//             const { page, pageSize, query, categoryId } = params;

//             console.log("Page:", page, "PageSize:", pageSize);
//             console.log("Query:", query, "CategoryId:", categoryId);

//             const items = await this.itemService.getItems({
//                 query: query ? (query as string) : undefined,
//                 page: page ? parseInt(page as string) : 1,
//                 pokeItemPocketId: categoryId ? parseInt(categoryId as string) : undefined,
//                 pageSize: pageSize ? parseInt(pageSize as string) : 20,
//             });

//             return items;
//         }
// }

// export default ItemsController;