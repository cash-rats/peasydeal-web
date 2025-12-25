import React, { useEffect } from 'react'
import type { LinksFunction, MetaFunction } from 'react-router';
import type { Route } from './+types/root';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';

import {
  getIndexTitleText,
  getIndexDescText,
  getRootFBSEO_V2,
} from '~/utils/seo';
import { env } from '~/utils/env';
import { storeDailySession } from '~/services/daily_session.server';
import { storeSessionIDToSessionStore } from '~/services/daily_session';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import type { Category } from '~/shared/types';

import useRudderStackScript from './hooks/useRudderStackScript';
import useGTMScript from './hooks/useGTMScript';
import useGoogleAnalytics from './hooks/useGoogleAnalytics';
import FiveHundredError from './components/FiveHundreError';
import FourOhFour from './components/FourOhFour';
import Layout, { links as LayoutLinks } from './Layout';
// import { links as cartLinks } from '~/routes/cart/route';
import { CartProvider } from '~/routes/hooks';
import tailwindStylesheetUrl from './styles/tailwind.css?url';
import styles from './styles/global.css?url';
import structuredData from './structured_data';

export const links: LinksFunction = () => {
  return [
    { rel: 'icon', type: 'image/x-icon', sizes: 'any', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'icon', type: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon-180x180.png' },
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'stylesheet', href: tailwindStylesheetUrl },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
    },
    { rel: 'stylesheet', href: styles },
    // ...cartLinks(),
    ...LayoutLinks(),
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const [gaSessionID, categoriesResult] = await Promise.all([
    storeDailySession().catch((e) => {
      console.log('TODO: failed to store session id to redis', e);
      return null;
    }),
    fetchCategoriesWithSplitAndHotDealInPlaced().catch((e) => {
      console.log('Failed to fetch categories', e);
      return [[], []] as [Category[], Category[]];
    }),
  ]);

  const [navBarCategories, categories] = categoriesResult;

  return {
    env,
    gaSessionID,
    categories,
    navBarCategories,
  };
}

export type RootLoaderData = Awaited<ReturnType<typeof loader>>;

export function shouldRevalidate({ formMethod }: { formMethod?: string }) {
  if (formMethod && formMethod.toUpperCase() !== 'GET') return true;
  return false;
}

export const meta: MetaFunction = () => {
  return [
    { charSet: 'utf-8' },
    { title: getIndexTitleText() },
    { name: 'description', content: getIndexDescText() },
    { httpEquiv: 'content-type', content: 'text/html; charset=UTF-8' },
    ...getRootFBSEO_V2(),
    ...(env.VERCEL_ENV === 'development' ? [{ name: 'robots', content: 'noindex,nofollow' }] : []),
    ...(env.VERCEL_ENV === 'preview' ? [{ name: 'robots', content: 'noindex,nofollow' }] : []),
    ...(env.VERCEL_ENV === 'production' ? [{ name: 'robots', content: 'index,follow' }] : []),
    { name: 'msapplicationTileColor', content: 'da532c' },
    { name: 'themeColor', content: '#ffffff' },
    { 'script:ld+json': structuredData() },
  ];
};

interface DocumentProps {
  children: React.ReactNode;
}

function Document({ children }: DocumentProps) {
  const { env: envData, gaSessionID } = useLoaderData() || {};

  useEffect(() => {
    storeSessionIDToSessionStore(gaSessionID);
  }, [gaSessionID]);

  useGTMScript({
    env: envData?.NODE_ENV,
    googleTagID: envData?.GOOGLE_TAG_ID,
  });

  useRudderStackScript({
    env: envData?.NODE_ENV,
    rudderStackKey: envData?.RUDDER_STACK_KEY,
    rudderStackUrl: envData?.RUDDER_STACK_URL,
  });

  useGoogleAnalytics({
    env: envData?.VERCEL_ENV,
    measurementId: envData?.GOOGLE_ANALYTICS_ID,
    sessionId: gaSessionID,
  });

  return (
    <html lang="en">
      <head suppressHydrationWarning>
        <Meta />
        <Links />
        <meta name="facebook-domain-verification" content="pfise5cnp4bnc9yh51ib1e9h6av2v8" />
        <meta name="google-site-verification" content="y_IC62RND-gmcbw_K_Hr9uw_8UHGnO9XIyO_fG2q09E" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {envData?.VERCEL_ENV === 'production' &&
          envData?.NODE_ENV !== 'development' &&
          envData?.GOOGLE_ANALYTICS_ID ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${envData.GOOGLE_ANALYTICS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', '${envData.GOOGLE_ANALYTICS_ID}', { send_page_view: false });
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        <noscript>
          {envData && envData.GOOGLE_TAG_ID ? (
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${env.GOOGLE_TAG_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          ) : null}
        </noscript>

        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.ENV=${JSON.stringify(envData)}
              `,
          }}
        />
        {children}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document>
        <Layout>
          <FourOhFour />
        </Layout>
      </Document>
    );
  }

  return (
    <Document>
      <Layout>
        <FiveHundredError error={error instanceof Error ? error : new Error('Unknown error')} />
      </Layout>
    </Document>
  );
}

export default function App() {
  return (
    <Document>
      <CartProvider>
        <Layout>
          <Outlet />
        </Layout>
      </CartProvider>
    </Document>
  );
}
