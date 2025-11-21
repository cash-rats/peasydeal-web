import type { MimeType } from './file';
import type { TransformOptions } from './transformer';

export type Resolver = (
  asset: string,
  url: string,
  options: TransformOptions,
  basePath: string
) => Promise<{
  buffer: Uint8Array;
  contentType: MimeType;
}>;

