import { cacheConfig } from "./types";
interface ConfigObject {
    apiKey: string;
    cache?: cacheConfig;
}
export declare type TarkovMarketConfig = ConfigObject | string;
export {};
