import type { LoaderFunctionArgs } from 'react-router';

import { ioredis as redis } from '~/redis.server';
import { getCanonicalDomain } from '~/utils/seo';
import { ContentfulGQLApi } from '~/routes/blog/api';

const BLOG_SITEMAP_KEY = 'sitemap:blog';
const BLOG_SITEMAP_TTL_SECONDS = 60 * 60 * 24; // 1 day
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const EMPTY_SITEMAP_XML = [
  XML_HEADER,
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
].join('\n');

const buildBlogSitemap = async (domain: string): Promise<{ xml: string; count: number }> => {
  const host = domain.replace(/\/+$/, '');
  const posts: Array<{ slug: string; publishedDate: string }> =
    await ContentfulGQLApi.getAllPostSlugs();

  const urls = posts
    .map(({ slug, publishedDate }) => {
      const loc = `${host}/blog/post/${slug}`;
      const lastmod = publishedDate
        ? new Date(publishedDate).toISOString().split('T')[0]
        : undefined;
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.6</priority>',
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    XML_HEADER,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
  ].join('\n');

  return { xml, count: posts.length };
};

export const loader = async (_args: LoaderFunctionArgs) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/xml; charset=utf-8',
  };

  const cached = await redis.get(BLOG_SITEMAP_KEY).catch(() => null);
  if (cached) {
    headers['X-Sitemap-Source'] = 'cache';
    headers['X-Sitemap-Key'] = BLOG_SITEMAP_KEY;
    return new Response(cached, { headers });
  }

  try {
    const { xml, count } = await buildBlogSitemap(getCanonicalDomain());

    try {
      await redis.set(BLOG_SITEMAP_KEY, xml, 'EX', BLOG_SITEMAP_TTL_SECONDS);
    } catch (err) {
      console.error('Failed to cache blog sitemap XML', err);
    }

    headers['X-Sitemap-Source'] = 'fresh';
    headers['X-Sitemap-Key'] = BLOG_SITEMAP_KEY;
    headers['X-Sitemap-Count'] = count.toString();
    return new Response(xml, { headers });
  } catch (err) {
    console.error('Failed to build blog sitemap XML', err);
    headers['X-Sitemap-Status'] = 'unavailable';
    return new Response(EMPTY_SITEMAP_XML, { status: 503, headers });
  }
};
