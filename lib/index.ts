import fetch from 'node-fetch';
import { TarkovMarketConfig } from './config';
import { TarkovMarketItem } from './types';

const apiMirrors: string[] = [
  "https://tarkov-market.com/api/v1",
  "https://ru.tarkov-market.com/api/v1"
];

export default class TarkovMarket {
  private apiUrl: string = 'https://ru.tarkov-market.com/api/v1';
  private apiKey: string;
  constructor (config: TarkovMarketConfig) {
    if (typeof config === "string") this.apiKey = config;
    else {
      this.apiKey = config.apiKey;
    }
    this.bestMirror();
  }

  public async getItem () {
    
  }

  public async getAll (): Promise<TarkovMarketItem[]> {
    const items = await this.request('items/all');
    const final: any[] = [];
    for (const item of items) {
      final.push(this.cleanItem(item));
    }
    return final;
  }

  private async bestMirror () {
    const results = {};
    for (const url of apiMirrors) {
      const start = Date.now();
      results[url] = Date.now() - start;
    }
  }

  private async request (endpoint: string, query: {} = {}): Promise<any> {
    let q = '';
    for (const key in query) {
      q += `&${key}=${query[key]}`;
    }
    const res = await fetch(`${this.apiUrl}/${endpoint}?x-api-key=${this.apiKey}${q}`);
    if (res.status !== 200) return undefined;
    const data: any = await res.json();
    return data;
  }

  private cleanItem (item: any) {
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
      diff7d: item.diff7days
    };
    Object.keys(sendBack).forEach(key => sendBack[key] === undefined && delete sendBack[key]);
    return sendBack;
  }
}