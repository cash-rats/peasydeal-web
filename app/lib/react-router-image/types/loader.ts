import type { Cache } from './cache';
import type { MimeType } from './file';
import type { Resolver } from './resolver';
import type { SizelessOptions, Transformer } from './transformer';

export interface LoaderConfig {
  selfUrl: string;
  resolver?: Resolver;
  transformer?: Transformer | null;
  useFallbackFormat?: boolean;
  fallbackFormat?: MimeType;
  useFallbackTransformer?: boolean;
  fallbackTransformer?: Transformer;
  cache?: Cache | null;
  defaultOptions?: SizelessOptions;
  redirectOnFail?: boolean;
  skipFormats?: Set<MimeType> | null;
  basePath?: string;
  whitelistedDomains?: string[] | null;
  blacklistedDomains?: string[] | null;
  verbose?: boolean;
}

export type AssetLoader = (
  config: LoaderConfig,
  request: Request
) => Promise<Response>;

