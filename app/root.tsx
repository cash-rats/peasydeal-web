import React, { useContext } from 'react'
import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { withEmotionCache } from '@emotion/react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material';
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

// TOOD deprecate chakra in favor of mui
// import { ChakraProvider } from '@chakra-ui/react';

// TODO deprecate it in favor of mui
import SnackbarProvider from 'react-simple-snackbar';

import Layout from './Layout';
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { ServerStyleContext, ClientStyleContext } from "./context"
import styles from "./styles/global.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Peasy Deals",
  viewport: "width=device-width,initial-scale=1",
});

export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
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
  ]
}

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
    ENV: {
      MYFB_END_POINT: process.env.MYFB_ENDPOINT,
      PEASY_DEAL_ENDPOINT: process.env.PEASY_DEAL_ENDPOINT,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      STRIPE_PAYMENT_RETURN_URI: process.env.STRIPE_PAYMENT_RETURN_URI,
    }
  });
}
interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);
    const envData = useLoaderData();

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

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          <meta name="emotion-insertion-point" content="emotion-insertion-point" />
          {


          }

          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}

        </head>
        <body>
          {children}

          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.ENV=${JSON.stringify(envData)}
              `
            }}
          />

          <ScrollRestoration />

          <Scripts />

          {process.env.NODE_ENV === "development" && <LiveReload />}
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <SnackbarProvider>
        <Layout>
          <Outlet />
        </Layout>
      </SnackbarProvider>
    </Document>
  );
}
