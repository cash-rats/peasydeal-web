import React, { useContext } from 'react'
import type {
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import { withEmotionCache } from '@emotion/react';
import { ChakraProvider } from '@chakra-ui/react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material';
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from "@remix-run/react";
import {
  DynamicLinks,
  ClientOnly,
} from 'remix-utils'
import remixImageStyles from "remix-image/remix-image.css";

import {
  getIndexTitleText,
  getIndexDescText,
  getRootFBSEO_V2,
} from '~/utils/seo'
import { envs, isProd, isStaging, isDev } from '~/utils/get_env_source';
import { getGASessionID } from '~/utils/get_ga_session_id.server';
import { storeDailySession } from '~/services/daily_session.server';
import { storeSessionIDToSessionStore } from '~/services/daily_session';

import useRudderStackScript from './hooks/useRudderStackScript';
import useGTMScript from './hooks/useGTMScript';
import FiveHundredError from './components/FiveHundreError';
import FourOhFour from './components/FourOhFour';
import Layout, { links as LayoutLinks } from './Layout';
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { ClientStyleContext, ServerStyleContext } from "./context"
import styles from "./styles/global.css";
import structuredData from './structured_data';
import ScrollRestoration from './ConditionalScrollRestoration';

export let links: LinksFunction = () => {
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
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
    },

    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: remixImageStyles },
    ...LayoutLinks(),
  ]
}

export async function loader({ request }: LoaderArgs) {
  const gaSessionID = getGASessionID();  // store session ID to redis list for future tracking of actions.
  await storeDailySession(gaSessionID);
  return json({ envs, gaSessionID });
}

export let meta: V2_MetaFunction<typeof loader> = () => {
  return [
    {
      tagName: 'meta',
      charSet: 'utf-8',
    },
    {
      title: getIndexTitleText(),
    },
    {
      tagName: 'meta',
      name: 'description',
      content: getIndexDescText(),
    },
    {
      tagName: 'meta',
      httpEquiv: 'content-type',
      content: 'text/html; charset=UTF-8',
    },

    // Facebook meta
    ...getRootFBSEO_V2(),

    // Disallow robot crawling in dev / staging environment
    isDev({
      tagName: 'meta',
      name: 'robots',
      content: 'noindex,nofollow',
    }),

    isStaging({
      tagName: 'meta',
      name: 'robots',
      content: 'noindex,nofollow',
    }),

    isProd({
      tagName: 'meta',
      name: 'robots',
      content: 'index,follow',
    }),

    {
      tagName: 'meta',
      name: 'msapplicationTileColor',
      content: 'da532c',
    },
    {
      tagName: 'meta',
      name: 'themeColor',
      content: '#ffffff',
    },
    { 'script:ld+json': structuredData() }
  ];
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext)
    const clientStyleData = useContext(ClientStyleContext);
    const { envs, gaSessionID } = useLoaderData() || {};

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();

      // set ga session id to session storage. we'll use this ID
      // to track actions during this session.
      storeSessionIDToSessionStore(gaSessionID);
    }, []);

    useGTMScript({
      env: envs?.NODE_ENV,
      googleTagID: envs?.GOOGLE_TAG_ID,
    });

    useRudderStackScript({
      env: envs?.NODE_ENV,
      rudderStackKey: envs?.RUDDER_STACK_KEY,
      rudderStackUrl: envs?.RUDDER_STACK_URL,
    });

    return (
      <html lang="en">
        <head>
          <Meta />
          <DynamicLinks />
          <Links />
          <meta name="emotion-insertion-point" content="emotion-insertion-point" />
          <meta name="facebook-domain-verification" content="pfise5cnp4bnc9yh51ib1e9h6av2v8" />
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>

          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>

        <body>
          {/* <!-- Google Tag Manager (noscript) --> */}
          <noscript>
            {
              envs && envs.GOOGLE_TAG_ID
                ? (
                  <iframe
                    title='Google Tag Manager'
                    src={`https://www.googletagmanager.com/ns.html?id=${envs.GOOGLE_TAG_ID}`}
                    height="0"
                    width="0"
                    style={{ display: 'none', visibility: 'hidden' }}
                  />
                )
                : null
            }
          </noscript>

          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.ENV=${JSON.stringify(envs)}
              `
            }}
          />
          <ChakraProvider>
            {children}
          </ChakraProvider>

          <ClientOnly fallback={null}>
            {() => <ScrollRestoration />}
          </ClientOnly>

          <Scripts />

          {process.env.NODE_ENV === "development" && <LiveReload />}
        </body>
      </html>
    );
  }
);

export function CatchBoundary() {
  return (
    <Document>
      <Layout>
        <FourOhFour />
      </Layout>
    </Document>
  );
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <Layout>
        <FiveHundredError error={error} />
      </Layout>
    </Document>
  );
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}
