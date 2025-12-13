import type { LoaderFunctionArgs } from 'react-router';

import { ioredis as redis } from '~/redis.server';
import { getCanonicalDomain } from '~/utils/seo';

const SITEMAP_INDEX_KEY = 'sitemap:index';
const SITEMAP_PATHS = [
  'sitemaps.static-pages.xml',
  'sitemaps.collections.xml',
  'sitemaps.promotions.xml',
  'sitemaps.products.xml',
];
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';

const buildSitemapIndex = (domain: string): string => {
  const host = domain.replace(/\/+$/, '');
  const lastmod = new Date().toISOString();

  const children = SITEMAP_PATHS
    .map((path) => {
      const loc = `${host}/${path.replace(/^\/+/, '')}`;
      return [
        '  <sitemap>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '  </sitemap>',
      ].join('\n');
    })
    .join('\n');

  return [
    XML_HEADER,
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    children,
    '</sitemapindex>',
  ].join('\n');
};

export const loader = async (_args: LoaderFunctionArgs) => {
  const headers = {
    'Content-Type': 'application/xml; charset=utf-8',
  };

  const cached = await redis.get(SITEMAP_INDEX_KEY).catch(() => null);
  if (cached) {
    return new Response(cached, { headers });
  }

  const xml = buildSitemapIndex(getCanonicalDomain());

  try {
    await redis.set(SITEMAP_INDEX_KEY, xml);
  } catch (err) {
    console.error('Failed to cache sitemap index XML', err);
  }

  return new Response(xml, { headers });
};
