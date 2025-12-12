import type { LoaderFunctionArgs } from 'react-router';

import { ioredis as redis } from '~/redis.server';

const PRODUCT_SITEMAP_LIVE_KEY = 'sitemap:products';
const PRODUCT_SITEMAP_STAGING_KEY = 'sitemap:products:next';
const PRODUCT_SITEMAP_META_KEY = 'sitemap:products:meta';
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const EMPTY_SITEMAP_XML = [
  XML_HEADER,
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
].join('\n');

type SitemapMeta = {
  generated_at?: string;
  count?: number;
};

const getSitemapXml = async (key: string): Promise<string | null> => {
  try {
    const xml = await redis.get(key);
    return xml ?? null;
  } catch (error) {
    console.error(`Failed to fetch sitemap XML from key "${key}"`, error);
    return null;
  }
};

const getSitemapMeta = async (): Promise<SitemapMeta | null> => {
  try {
    const metaRaw = await redis.get(PRODUCT_SITEMAP_META_KEY);
    if (!metaRaw) return null;

    return JSON.parse(metaRaw) as SitemapMeta;
  } catch (error) {
    console.error('Failed to fetch sitemap meta', error);
    return null;
  }
};

export const loader = async (_args: LoaderFunctionArgs) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/xml; charset=utf-8',
  };

  const meta = await getSitemapMeta();
  if (meta?.generated_at) {
    headers['X-Sitemap-Generated-At'] = meta.generated_at;
  }
  if (meta?.count) {
    headers['X-Sitemap-Count'] = meta.count.toString();
  }

  let sourceKey: string | null = null;
  let xml = await getSitemapXml(PRODUCT_SITEMAP_LIVE_KEY);
  if (xml) {
    sourceKey = PRODUCT_SITEMAP_LIVE_KEY;
  } else {
    xml = await getSitemapXml(PRODUCT_SITEMAP_STAGING_KEY);
    if (xml) {
      sourceKey = PRODUCT_SITEMAP_STAGING_KEY;
    }
  }

  if (xml) {
    headers['X-Sitemap-Key'] = sourceKey ?? '';
    return new Response(xml, { headers });
  }

  headers['X-Sitemap-Key'] = 'missing';
  headers['X-Sitemap-Status'] = 'unavailable';
  return new Response(EMPTY_SITEMAP_XML, { status: 503, headers });
};
