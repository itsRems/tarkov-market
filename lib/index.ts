import fetch from 'node-fetch';
import { TarkovMarketConfig } from './config';
import { cacheConfig, TarkovMarketItem } from './types';

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
  constructor (config: TarkovMarketConfig) {
    if (typeof config === "string") this.apiKey = config;
    else {
      this.apiKey = config.apiKey;
      if (config.cache) {
        this.cache = config.cache;
        this.cachePrefix = config.cache?.prefix || 'TM-C';
      }
    }
    this.bestMirror();
  }

  public async getItem (id: string): Promise<TarkovMarketItem> {
    const ck = `${this.cachePrefix}-cache-item-${id}`;
    if (this.cache) {
      const cached = await this.cache.get(ck);
      if (cached) return cached;
    }
    const item = await this.request('item', { uid: id });
    const final = this.cleanItem(item[0]);
    if (this.cache) await this.cache.set(ck, final, this.cacheTtl);
    return final;
  }

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

  private async bestMirror () {
    const results = {};
    for (const url of apiMirrors) {
      const start = Date.now();
      results[url] = Date.now() - start;
    }
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

  private cleanItem (item: any) {
    if (!item?.uid) return item;
    const sendBack = {
      id: item.uid,
      icon: item.icon || item.img || item.imgBig,
      price: item.basePrice,
      base_price: item.basePrice,
      avg_price_d: item.avg24hPrice,
      avg_price_w: item.avg7daysPrice,
      trader_price: `${item.traderPriceCur}${item.traderPrice}`,
      name: item.name,
      short_name: item.shortName,
      slots: item.slots,
      trader: item.traderName,
      diff24: item.diff24h,
      diff7d: item.diff7days,
      tags: item.tags
    };
    Object.keys(sendBack).forEach(key => sendBack[key] === undefined && delete sendBack[key]);
    return sendBack;
  }
}