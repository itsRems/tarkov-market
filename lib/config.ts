import { cacheConfig } from "./types";

interface ConfigObject {
  apiKey: string;
  cache?: cacheConfig;
};

export type TarkovMarketConfig = ConfigObject | string;