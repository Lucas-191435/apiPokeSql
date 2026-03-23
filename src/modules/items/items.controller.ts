import ItemService from "./items.service";

class ItemsController {
    private itemService: ItemService;
    constructor() {
        this.itemService = new ItemService();
    }

    async getItems(params: {
        page: string;
        pageSize: string;}) {
            const { page, pageSize } = params;
            console.log("Page:", page, "PageSize:", pageSize);
            const items = await this.itemService.getItems({
                page: page ? parseInt(page as string) : 1,
                pageSize: pageSize ? parseInt(pageSize as string) : 30,
            });

            return items;
        }
}

export default ItemsController;