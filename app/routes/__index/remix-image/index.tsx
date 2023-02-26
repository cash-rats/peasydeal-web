import type { LoaderFunction } from "@remix-run/server-runtime";
import { imageLoader, MemoryCache } from 'remix-image/server';
import type { LoaderConfig } from 'remix-image';
import httpStatus from 'http-status-codes';

import { CDN_URL } from '~/utils/get_env_source';

import transformer from './transformer';
import { imageResponse, badImageResponse } from './response'
import { fileExtensionResolver, MimeType } from './mimes';

const config: LoaderConfig = {
  selfUrl: `${CDN_URL}/product-images`,
  cache: new MemoryCache(),
  transformer,
};

const composeCDNUrl = (params: { width: number, height: number, filename: string }) => {
  const url = new URL(CDN_URL);
  url.pathname = `webp/w${params.width}_h${params.height}/${params.filename}`;
  return url.toString();
};

const maxAge = 60 * 60 * 24 * 365;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const width = url.searchParams.get('width') as string || '';
  const height = url.searchParams.get('height') as string || '';
  const src = url.searchParams.get('src') as string || '';
  const contentType = url.searchParams.get('contentType') as MimeType || MimeType.WEBP;
  const fileExt = fileExtensionResolver.get(contentType);

  if (src === '') return badImageResponse();

  if (width && height && src && fileExt) {
    const filename = src.substring(src.lastIndexOf('/') + 1, src.length);
    const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));

    const dnsURL = composeCDNUrl({
      width: parseInt(width),
      height: parseInt(height),
      filename: `${filenameWithoutExt}${fileExt}`,
    });

    const imageFromCDN = await fetch(dnsURL);

    // image exists in CDN, simply return the image.
    if (imageFromCDN.ok && imageFromCDN.body) {
      return imageResponse(
        new Uint8Array(await imageFromCDN.arrayBuffer()),
        httpStatus.OK,
        MimeType.WEBP,
        `public, max-age=${maxAge}`
      );
    }
  }

  return imageLoader(config, request);
};