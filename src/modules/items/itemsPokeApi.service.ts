import { PokeAPIClient } from "../../services/pokeApiService";

class ItemsPokeAPI {
    getItems = async () => {
        try {
            const getItems: {
                count: number;
                next: string | null;
                previous: string | null;
                results: Array<{
                    name: string;
                    url: string;
                }>;
            } = await PokeAPIClient.get(`item`, {
                params: {
                    limit: 10,
                    offset: 0,
                },
            });
            return getItems;
        } catch (error) {
            console.error("Error fetching items from PokeAPI:", error);
            throw error;
        }
    }

    getItemCategory = async () => {
        try {
            const itemCategory: {
                count: number;
                next: string | null;
                previous: string | null;
                results: Array<{
                    name: string;
                    url: string;
                }>;
            }
                = await PokeAPIClient.get(`item-category`, {
                    params: {
                        limit: 55,
                        offset: 0,
                    },
                });
            return itemCategory;
        } catch (error) {
            console.error("Error fetching items from PokeAPI:", error);
            throw error;
        }
    }

    findItemCategory = async (id: number) => {
        try {
            const itemCategory: {
                id: number;
                items: Array<{
                    name: string;
                    url: string;
                }>;
                name: string;
                names: Array<{
                    language: {
                        name: string;
                        url: string;
                    };
                    name: string;
                }>;
                pocket: {
                    name: string;
                    url: string;
                };
            } = await PokeAPIClient.get(`item-category/${id}`);
            return itemCategory;
        } catch (error) {
            console.error("Error fetching items from PokeAPI:", error);
            throw error;
        }
    }

    findItem = async (id: number) => {
        try {
            const item: {
                attributes: Array<{
                    name: string;
                    url: string;
                }>;
                baby_trigger_for: null | any;
                category: {
                    name: string;
                    url: string;
                };
                cost: number;
                effect_entries: Array<{
                    effect: string;
                    language: {
                        name: string;
                        url: string;
                    };
                    short_effect: string;
                }>;
                flavor_text_entries: Array<{
                    language: {
                        name: string;
                        url: string;
                    };
                    text: string;
                    version_group: {
                        name: string;
                        url: string;
                    };
                }>;
                fling_effect: null | any;
                fling_power: null | number;
                game_indices: Array<{
                    game_index: number;
                    generation: {
                        name: string;
                        url: string;
                    };
                }>;
                held_by_pokemon: Array<{
                    pokemon: {
                        name: string;
                        url: string;
                    };
                    version_details: Array<{
                        rarity: number;
                        version: {
                            name: string;
                            url: string;
                        };
                    }>;
                }>;
                id: number;
                machines: Array<{
                    machine: {
                        url: string;
                    };
                    version_group: {
                        name: string;
                        url: string;
                    }
                }
                >; 
                name: string;
                sprites: {
                    default: string;
                };
            } = await PokeAPIClient.get(`item/${id}`);
            return item;
        } catch (error) {
            console.error("Error fetching items from PokeAPI:", error);
            throw error;
        }
    }
}

export default ItemsPokeAPI;