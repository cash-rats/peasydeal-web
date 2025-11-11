import React, { useContext } from 'react'
import type { LinksFunction, MetaFunction } from 'react-router';
import type { Route } from './+types/root';
import { withEmotionCache } from '@emotion/react';
import { ChakraProvider } from '@chakra-ui/react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material';
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
import { getItemCount } from '~/sessions/shoppingcart.session.server';

import useRudderStackScript from './hooks/useRudderStackScript';
import useGTMScript from './hooks/useGTMScript';
import FiveHundredError from './components/FiveHundreError';
import FourOhFour from './components/FourOhFour';
import Layout, { links as LayoutLinks } from './Layout';
import tailwindStylesheetUrl from './styles/tailwind.css?url';
import { ClientStyleContext, ServerStyleContext } from './context';
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
    ...LayoutLinks(),
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const gaSessionID = await storeDailySession();
    const cartCount = await getItemCount(request);
    return {
      env,
      gaSessionID,
      cartCount,
    };
  } catch (e) {
    console.log('TODO: failed to store session id to redis', e);
    return {
      env,
      gaSessionID: null,
      cartCount: 0,
    };
  }
}

export const meta: MetaFunction = () => {
  return [
    { charSet: 'utf-8' },
    { title: getIndexTitleText() },
    { name: 'description', content: getIndexDescText() },
    { httpEquiv: 'content-type', content: 'text/html; charset=UTF-8' },
    ...getRootFBSEO_V2(),
    ...(env.NODE_ENV === 'development' ? [{ name: 'robots', content: 'noindex,nofollow' }] : []),
    ...(env.NODE_ENV === 'staging' ? [{ name: 'robots', content: 'noindex,nofollow' }] : []),
    ...(env.NODE_ENV === 'production' ? [{ name: 'robots', content: 'index,follow' }] : []),
    { name: 'msapplicationTileColor', content: 'da532c' },
    { name: 'themeColor', content: '#ffffff' },
    { 'script:ld+json': structuredData() },
  ];
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);
    const { env: envData, gaSessionID } = useLoaderData() || {};

    // Only executed on client; mirrors MUI SSR recipe
    useEnhancedEffect(() => {
      emotionCache.sheet.container = document.head;
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      clientStyleData?.reset();
      storeSessionIDToSessionStore(gaSessionID);
    }, []);

    useGTMScript({
      env: envData?.NODE_ENV,
      googleTagID: envData?.GOOGLE_TAG_ID,
    });

    useRudderStackScript({
      env: envData?.NODE_ENV,
      rudderStackKey: envData?.RUDDER_STACK_KEY,
      rudderStackUrl: envData?.RUDDER_STACK_URL,
    });

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          <meta name="emotion-insertion-point" content="emotion-insertion-point" />
          <meta name="facebook-domain-verification" content="pfise5cnp4bnc9yh51ib1e9h6av2v8" />
          <meta name="google-site-verification" content="y_IC62RND-gmcbw_K_Hr9uw_8UHGnO9XIyO_fG2q09E" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          <noscript>
            {env && env.GOOGLE_TAG_ID ? (
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
                window.ENV=${JSON.stringify(env)}
              `,
            }}
          />
          <ChakraProvider>
            {children}
          </ChakraProvider>

          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
);

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
  console.log('~~ 1');
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}
