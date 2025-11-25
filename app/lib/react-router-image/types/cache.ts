export interface CacheConfig {
  ttl: number;
  tbd: number;
}

export enum CacheStatus {
  HIT = 'hit',
  STALE = 'stale',
  MISS = 'miss',
}

export abstract class Cache {
  abstract config: CacheConfig;

  abstract has(key: string): Promise<boolean>;

  abstract status(key: string): Promise<CacheStatus>;

  abstract get(key: string): Promise<Uint8Array | null>;

  abstract set(key: string, resultImg: Uint8Array): Promise<void>;

  abstract clear(): Promise<void>;
}

