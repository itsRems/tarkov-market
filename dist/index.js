"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const apiMirrors = [
    "https://tarkov-market.com/api/v1",
    "https://ru.tarkov-market.com/api/v1"
];
class TarkovMarket {
    /**
     * Initialize a new TarkovMarket class
     * @param config either your api key or a config object
     */
    constructor(config) {
        var _a;
        this.apiUrl = 'https://ru.tarkov-market.com/api/v1';
        this.cachePrefix = 'TM-C';
        this.cacheTtl = 5 * 60 * 1000;
        if (typeof config === "string")
            this.apiKey = config;
        else {
            this.apiKey = config.apiKey;
            if (config.cache) {
                this.cache = config.cache;
                this.cachePrefix = ((_a = config.cache) === null || _a === void 0 ? void 0 : _a.prefix) || 'TM-C';
            }
        }
        this.useBestMirror();
    }
    /**
     * Used to retrieve a single item
     * @param id the item's id
     * @returns the clean item body
     */
    getItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ck = `${this.cachePrefix}-cache-item-${id}`;
            if (this.cache) {
                const cached = yield this.cache.get(ck);
                if (cached)
                    return cached;
            }
            const res = yield this.request('item', { uid: id });
            if (res.length < 1)
                return undefined;
            const final = this.cleanItem(res[0]);
            if (this.cache)
                yield this.cache.set(ck, final, this.cacheTtl);
            return final;
        });
    }
    /**
     * Gets the entire item list from the api
     * @returns all the current in-game items
     */
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ck = `${this.cachePrefix}-all-items-cache`;
                if (this.cache) {
                    const cached = yield this.cache.get(ck);
                    if (cached)
                        return cached;
                }
                const items = yield this.request('items/all');
                const final = [];
                for (const item of items) {
                    final.push(this.cleanItem(item));
                }
                if (this.cache)
                    yield this.cache.set(ck, final, this.cacheTtl);
                return final;
            }
            catch (error) {
                console.log(`[Tarkov Market] ERROR FETCHING ALL ITEMS`, error);
                return [];
            }
        });
    }
    /**
     * Uses tarkov-market's search system to query items
     * @param query the search query (a string)
     * @returns an array of items that match your query
     */
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ck = `${this.cachePrefix}-search-q-${query}`;
                if (this.cache) {
                    const cached = yield this.cache.get(ck);
                    if (cached)
                        return cached;
                }
                const items = yield this.request('item', { q: query });
                const final = [];
                for (const item of items) {
                    final.push(this.cleanItem(item));
                }
                if (this.cache)
                    yield this.cache.set(ck, final, this.cacheTtl);
                return final;
            }
            catch (error) {
                console.log(`[Tarkov Market] ERROR SEARCHING ITEMS (q: ${query})`, error);
                return [];
            }
        });
    }
    useBestMirror() {
        return __awaiter(this, void 0, void 0, function* () {
            let best;
            for (const url of apiMirrors) {
                const start = Date.now();
                const res = yield node_fetch_1.default(`${url}/items/all?x-api-key=${this.apiKey}`);
                if (res.status === 200) {
                    const time = Date.now() - start;
                    if (((best === null || best === void 0 ? void 0 : best.time) || 50000) > time)
                        best = { url, time };
                }
            }
            if (best)
                this.apiUrl = best.url;
        });
    }
    request(endpoint, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let q = '';
            if (query) {
                for (const key in query) {
                    q = `${q}&${key}=${query[key]}`;
                }
            }
            const res = yield node_fetch_1.default(`${this.apiUrl}/${endpoint}?x-api-key=${this.apiKey}${q}`);
            if (res.status !== 200)
                return undefined;
            const data = yield res.json();
            return data;
        });
    }
    cleanItem(item) {
        if (!(item === null || item === void 0 ? void 0 : item.uid))
            return undefined;
        const sendBack = {
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
            trader: item.traderName,
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
exports.default = TarkovMarket;
//# sourceMappingURL=index.js.map