import { TarkovMarketConfig } from './config';
import { TarkovMarketItem } from './types';
export default class TarkovMarket {
    private apiUrl;
    private apiKey;
    private cache?;
    cachePrefix: string;
    cacheTtl: number;
    /**
     * Initialize a new TarkovMarket class
     * @param config either your api key or a config object
     */
    constructor(config: TarkovMarketConfig);
    /**
     * Used to retrieve a single item
     * @param id the item's id
     * @returns the clean item body
     */
    getItem(id: string): Promise<TarkovMarketItem>;
    /**
     * Gets the entire item list from the api
     * @returns all the current in-game items
     */
    getAll(): Promise<TarkovMarketItem[]>;
    /**
     * Uses tarkov-market's search system to query items
     * @param query the search query (a string)
     * @returns an array of items that match your query
     */
    search(query: string): Promise<TarkovMarketItem[]>;
    private useBestMirror;
    private request;
    private cleanItem;
}
export type { TarkovMarketItem, RawTarkovMarketItemBody } from './types';
