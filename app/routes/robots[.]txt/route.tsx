import type { LoaderFunctionArgs } from 'react-router';

const ROBOTS_TXT = ['User-agent: *', 'Allow: /', '', 'Sitemap: https://peasydeal.com/sitemaps.xml'].join('\n');

export const loader = async (_args: LoaderFunctionArgs) => {
  return new Response(ROBOTS_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
