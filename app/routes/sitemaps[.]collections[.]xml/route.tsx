import type { LoaderFunctionArgs } from 'react-router';

import { fetchCategoriesRegardlessType } from '~/api/categories.server';
import { ioredis as redis } from '~/redis.server';
import { getCanonicalDomain } from '~/utils/seo';
import type { Category } from '~/shared/types';

const COLLECTION_SITEMAP_KEY = 'sitemap:collections';
const COLLECTION_SITEMAP_TTL_SECONDS = 60 * 60 * 24 * 5; // 5 days
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const EMPTY_SITEMAP_XML = [
  XML_HEADER,
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
].join('\n');

const buildCollectionSitemap = (domain: string, categories: Category[]): string => {
  const host = domain.replace(/\/+$/, '');

  const urls = categories
    .map((category) => category.name)
    .filter(Boolean)
    .map((slug) => {
      const loc = `${host}/collection/${slug}`;
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.7</priority>',
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [XML_HEADER, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', urls, '</urlset>'].join('\n');
};

const fetchCollectionsXml = async (): Promise<{ xml: string; count: number }> => {
  const { categories = [] } = await fetchCategoriesRegardlessType();
  const xml = buildCollectionSitemap(getCanonicalDomain(), categories);
  return { xml, count: categories.length };
};

export const loader = async (_args: LoaderFunctionArgs) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/xml; charset=utf-8',
  };

  const cached = await redis.get(COLLECTION_SITEMAP_KEY).catch(() => null);
  if (cached) {
    headers['X-Sitemap-Source'] = 'cache';
    headers['X-Sitemap-Key'] = COLLECTION_SITEMAP_KEY;
    return new Response(cached, { headers });
  }

  try {
    const { xml, count } = await fetchCollectionsXml();
    headers['X-Sitemap-Source'] = 'fresh';
    headers['X-Sitemap-Count'] = count.toString();
    headers['X-Sitemap-Key'] = COLLECTION_SITEMAP_KEY;

    try {
      await redis.set(COLLECTION_SITEMAP_KEY, xml, 'EX', COLLECTION_SITEMAP_TTL_SECONDS);
    } catch (err) {
      console.error('Failed to cache collection sitemap XML', err);
    }

    return new Response(xml, { headers });
  } catch (err) {
    console.error('Failed to build collection sitemap XML', err);
    headers['X-Sitemap-Status'] = 'unavailable';
    return new Response(EMPTY_SITEMAP_XML, { status: 503, headers });
  }
};
