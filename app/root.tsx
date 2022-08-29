import React, { useContext, useEffect } from 'react'
import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { withEmotionCache } from '@emotion/react'
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ChakraProvider } from '@chakra-ui/react'

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { ServerStyleContext, ClientStyleContext } from "./context"

// TODO should be removed. This is just an example for scss styling.
//import { links as LargeGridLinks } from "./routes/components/ProductGrid/LargeGrid";
import { links as LargeGridLinks } from "./routes/__index/product/$prodId";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export let links: LinksFunction = () => {
  return [
		// TODO should be removed. This is just an example for scss styling.
		...LargeGridLinks(),

		{ rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
    },
  ]
}

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
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
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
					{typeof document === "undefined" ? "__STYLES__" : null}
        </head>
        <body>
          {children}
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
      <ChakraProvider>
        <Outlet />

      </ChakraProvider>
    </Document>
  );
}
