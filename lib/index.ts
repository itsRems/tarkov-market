import fetch from 'node-fetch';
import { TarkovMarketConfig } from './config';
import { cacheConfig, RawTarkovMarketItemBody, TarkovMarketItem, TraderType } from './types';

const apiMirrors: string[] = [
  "https://tarkov-market.com/api/v1",
  "https://ru.tarkov-market.com/api/v1"
];

export default class TarkovMarket {
  private apiUrl: string = 'https://ru.tarkov-market.com/api/v1';
  private apiKey: string;
  private cache?: cacheConfig;
  public cachePrefix: string = 'TM-C';
  public cacheTtl: number = 5 * 60 * 1000;
  
  /**
   * Initialize a new TarkovMarket class
   * @param config either your api key or a config object
   */
  constructor (config: TarkovMarketConfig) {
    if (typeof config === "string") this.apiKey = config;
    else {
      this.apiKey = config.apiKey;
      if (config.cache) {
        this.cache = config.cache;
        this.cachePrefix = config.cache?.prefix || 'TM-C';
      }
    }
    this.useBestMirror();
  }

  /**
   * Used to retrieve a single item
   * @param id the item's id
   * @returns the clean item body
   */
  public async getItem (id: string): Promise<TarkovMarketItem> {
    const ck = `${this.cachePrefix}-cache-item-${id}`;
    if (this.cache) {
      const cached = await this.cache.get(ck);
      if (cached) return cached;
    }
    const res = await this.request('item', { uid: id });
    if (res.length < 1) return undefined;
    const final = this.cleanItem(res[0]);
    if (this.cache) await this.cache.set(ck, final, this.cacheTtl);
    return final;
  }

  /**
   * Gets the entire item list from the api
   * @returns all the current in-game items
   */
  public async getAll (): Promise<TarkovMarketItem[]> {
    try {
      const ck = `${this.cachePrefix}-all-items-cache`;
      if (this.cache) {
        const cached = await this.cache.get(ck);
        if (cached) return cached;
      }
      const items = await this.request('items/all');
      const final: any[] = [];
      for (const item of items) {
        final.push(this.cleanItem(item));
      }
      if (this.cache) await this.cache.set(ck, final, this.cacheTtl);
      return final;
    } catch (error) {
      console.log(`[Tarkov Market] ERROR FETCHING ALL ITEMS`, error);
      return [];
    }
  }

  /**
   * Uses tarkov-market's search system to query items
   * @param query the search query (a string)
   * @returns an array of items that match your query
   */
  public async search (query: string): Promise<TarkovMarketItem[]> {
    try {
      const ck = `${this.cachePrefix}-search-q-${query}`;
      if (this.cache) {
        const cached = await this.cache.get(ck);
        if (cached) return cached;
      }
      const items = await this.request('item', { q: query });
      const final: any[] = [];
      for (const item of items) {
        final.push(this.cleanItem(item));
      }
      if (this.cache) await this.cache.set(ck, final, this.cacheTtl);
      return final;
    } catch (error) {
      console.log(`[Tarkov Market] ERROR SEARCHING ITEMS (q: ${query})`, error);
      return [];
    }
  }

  private async useBestMirror () {
    let best: {
      url: string;
      time: number;
    };
    for (const url of apiMirrors) {
      const start = Date.now();
      const res = await fetch(`${url}/items/all?x-api-key=${this.apiKey}`);
      if (res.status === 200) {
        const time = Date.now() - start;
        if ((best?.time || 50000) > time) best = { url, time };
      }
    }
    if (best) this.apiUrl = best.url;
  }

  private async request (endpoint: string, query?: {}): Promise<any> {
    let q = '';
    if (query) {
      for (const key in query) {
        q = `${q}&${key}=${query[key]}`;
      }
    }
    const res = await fetch(`${this.apiUrl}/${endpoint}?x-api-key=${this.apiKey}${q}`);
    if (res.status !== 200) return undefined;
    const data: any = await res.json();
    return data;
  }

  private cleanItem (item: RawTarkovMarketItemBody): TarkovMarketItem {
    if (!item?.uid) return undefined;
    const sendBack: TarkovMarketItem = {
      id: item.uid,
      bsgId: item.bsgId,
      icon: item.icon || item.img || item.imgBig,
      price: item.price,
      base_price: item.basePrice,
      avg_price_d: item.avg24hPrice,
      avg_price_w: item.avg7daysPrice,
      trader_price: `${item.traderPriceCur}${item.traderPrice}`,
      name: item.name,
      short_name: item.shortName,
      slots: item.slots,
      trader: item.traderName.toLowerCase() as TraderType,
      diff24: item.diff24h,
      diff7d: item.diff7days,
      tags: item.tags,
      last_updated: item.updated,
      trader_currency: item.traderPriceCur
    };
    Object.keys(sendBack).forEach(key => sendBack[key] === undefined && delete sendBack[key]);
    return sendBack;
  }
}

export type { TarkovMarketItem, RawTarkovMarketItemBody } from './types';