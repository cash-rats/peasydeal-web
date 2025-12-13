import type { LoaderFunctionArgs } from 'react-router';

import { ioredis as redis } from '~/redis.server';
import { getCanonicalDomain } from '~/utils/seo';

const STATIC_SITEMAP_KEY = 'sitemap:static-pages';
const STATIC_SITEMAP_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const EMPTY_SITEMAP_XML = [
  XML_HEADER,
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
].join('\n');

const STATIC_PATHS: Array<{
  path: string;
  changefreq: string;
  priority: string;
}> = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/about-us', changefreq: 'yearly', priority: '0.6' },
  { path: '/contact-us', changefreq: 'yearly', priority: '0.6' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.5' },
  { path: '/return-policy', changefreq: 'yearly', priority: '0.5' },
  { path: '/shipping-policy', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms-of-use', changefreq: 'yearly', priority: '0.5' },
  { path: '/sell-on-peasydeal', changefreq: 'yearly', priority: '0.5' },
  { path: '/blog', changefreq: 'monthly', priority: '0.4' },
];

const buildStaticSitemap = (domain: string): string => {
  const host = domain.replace(/\/+$/, '');

  const urls = STATIC_PATHS.map(({ path, changefreq, priority }) => {
    const loc = `${host}${path}`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');

  return [XML_HEADER, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', urls, '</urlset>'].join('\n');
};

const buildAndCache = async (): Promise<{ xml: string; count: number }> => {
  const xml = buildStaticSitemap(getCanonicalDomain());
  const count = STATIC_PATHS.length;

  try {
    await redis.set(STATIC_SITEMAP_KEY, xml, 'EX', STATIC_SITEMAP_TTL_SECONDS);
  } catch (err) {
    console.error('Failed to cache static pages sitemap XML', err);
  }

  return { xml, count };
};

export const loader = async (_args: LoaderFunctionArgs) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/xml; charset=utf-8',
  };

  const cached = await redis.get(STATIC_SITEMAP_KEY).catch(() => null);
  if (cached) {
    headers['X-Sitemap-Source'] = 'cache';
    headers['X-Sitemap-Key'] = STATIC_SITEMAP_KEY;
    headers['X-Sitemap-Count'] = STATIC_PATHS.length.toString();
    return new Response(cached, { headers });
  }

  try {
    const { xml, count } = await buildAndCache();
    headers['X-Sitemap-Source'] = 'fresh';
    headers['X-Sitemap-Key'] = STATIC_SITEMAP_KEY;
    headers['X-Sitemap-Count'] = count.toString();
    return new Response(xml, { headers });
  } catch (err) {
    console.error('Failed to build static pages sitemap XML', err);
    headers['X-Sitemap-Status'] = 'unavailable';
    return new Response(EMPTY_SITEMAP_XML, { status: 503, headers });
  }
};
