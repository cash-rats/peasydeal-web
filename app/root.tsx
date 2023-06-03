import React, { useContext, useEffect } from 'react'
import type {
  LinksFunction,
  LoaderArgs,
  // MetaFunction,
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
} from '~/utils/seo'
import { getRootFBSEO_V2 } from '~/utils/seo';
import * as envs from '~/utils/get_env_source';

import FiveHundredError from './components/FiveHundreError';
import FourOhFour from './components/FourOhFour';
import Layout, { links as LayoutLinks } from './Layout';
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { ClientStyleContext, ServerStyleContext } from "./context"
import styles from "./styles/global.css";
import structuredData from './structured_data';
import ScrollRestoration from './ConditionalScrollRestoration';
import { title } from 'process';


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
  return json({
    user: await getUser(request),
    ...envs,
  });
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
      name: 'viewport',
      content: 'width=device-width,initial-scale=1',
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

    {
      tagName: 'meta',
      name: 'robots',
      content: 'index,follow',
    },
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
    const envData = useLoaderData() || {};

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
    }, []);


    // <!-- Google Tag Manager. Load on client side only  -->
    useEffect(() => {
      if (
        envData &&
        envData.NODE_ENV !== 'development' &&
        envData.GOOGLE_TAG_ID
      ) {
        const gtmScript = document.createElement('script');

        gtmScript.innerHTML = `
        (function(w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({
              'gtm.start': new Date().getTime(),
              event: 'gtm.js'
          });
          var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src =
              'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', '${envData.GOOGLE_TAG_ID}');`

        document.head.appendChild(gtmScript);


        return () => {
          if (
            document &&
            document.head &&
            document.head.contains(gtmScript)
          ) {
            document.head.removeChild(gtmScript)
          }
        }
      }
    }, [
      envData,
      envData?.GOOGLE_TAG_ID,
    ]);

    // <!-- Rudder stack. Load on client side only  -->
    useEffect(() => {
      if (
        envData &&
        envData.NODE_ENV !== 'development' &&
        envData.RUDDER_STACK_KEY &&
        envData.RUDDER_STACK_URL
      ) {
        const rudderStackScript = document.createElement('script');
        rudderStackScript.innerHTML = `
          !function(){var e=window.rudderanalytics=window.rudderanalytics||[];e.methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId","getUserId","getUserTraits","getGroupId","getGroupTraits","startSession","endSession"],e.factory=function(t){return function(){e.push([t].concat(Array.prototype.slice.call(arguments)))}};for(var t=0;t<e.methods.length;t++){var r=e.methods[t];e[r]=e.factory(r)}e.loadJS=function(e,t){var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a)},e.loadJS(),
          e.load("${envData.RUDDER_STACK_KEY}","${envData.RUDDER_STACK_URL}"),
          e.page()}();
        `
        document.head.appendChild(rudderStackScript);
      }
    }, [
      envData,
      envData?.RUDDER_STACK_KEY,
      envData?.RUDDER_STACK_URL,
    ]);

    return (
      <html lang="en">
        <head>
          <Meta />
          <DynamicLinks />
          <Links />
          {/* <StructuredData /> */}
          <meta name="emotion-insertion-point" content="emotion-insertion-point" />
          <meta name="facebook-domain-verification" content="pfise5cnp4bnc9yh51ib1e9h6av2v8" />

          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
          {/* <script dangerouslySetInnerHTML={{
            __html: `
                !function(){var e=window.rudderanalytics=window.rudderanalytics||[];e.methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId","getUserId","getUserTraits","getGroupId","getGroupTraits","startSession","endSession"],e.factory=function(t){return function(){e.push([t].concat(Array.prototype.slice.call(arguments)))}};for(var t=0;t<e.methods.length;t++){var r=e.methods[t];e[r]=e.factory(r)}e.loadJS=function(e,t){var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a)},e.loadJS(),
                e.load("${envData.RUDDER_STACK_KEY}","${envData.RUDDER_STACK_URL}"),
                e.page()}();
            `
          }} /> */}
        </head>

        <body>
          {/* <!-- Google Tag Manager (noscript) --> */}
          <noscript>
            {
              envData && envData.GOOGLE_TAG_ID
                ? (
                  <iframe
                    title='Google Tag Manager'
                    src={`https://www.googletagmanager.com/ns.html?id=${envData.GOOGLE_TAG_ID}`}
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
                window.ENV=${JSON.stringify(envData)}
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
