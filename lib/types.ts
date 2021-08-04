export type TraderType = 'prapor' | 'therapist' | 'fence' | 'skier' | 'peacekeeper' | 'mechanic' | 'ragman' | 'jaeger';
export type CurrencyType = '₽' | '€' | '$';

export interface TarkovMarketItem {
  readonly id: string;
  readonly price: number;
  readonly base_price: number;
  readonly avg_price_d: number;
  readonly avg_price_w: number;
  readonly trader_price: string;
  readonly name: string;
  readonly short_name: string;
  readonly slots: number;
  readonly trader: TraderType;
  readonly trader_currency: CurrencyType;
  readonly icon: string;
  readonly diff24: number;
  readonly diff7d: number;
  readonly tags: string[];
  readonly last_updated: string;
}

export interface RawTarkovMarketItemBody {
  uid: string;
  bsgId: string;
  name: string;
  shortName: string;
  price: number;
  basePrice: number;
  avg24hPrice: number;
  avg7daysPrice: number;
  traderName: TraderType;
  traderPrice: number;
  traderPriceCur: CurrencyType;
  updated: string;
  slots: number;
  diff24h: number;
  diff7days: number;
  icon: string;
  link: string;
  wikiLink: string;
  img: string;
  imgBig: string;
  reference: string;
  tags: string[];
}

export interface cacheConfig {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any, ttl: number) => Promise<void>;
  ttl?: number;
  prefix?: string;
}