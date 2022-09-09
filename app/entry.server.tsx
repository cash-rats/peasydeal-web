import { renderToString } from "react-dom/server";
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { RemixServer } from "@remix-run/react";
import { Response } from "@remix-run/node";
import type { EntryContext, Headers } from "@remix-run/node";
import { ServerStyleSheet } from "styled-components";

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { ServerStyleContext } from "./context";
import createEmotionCache from "./createEmotionCache";
import theme from './theme';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
	const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

	const sheet = new ServerStyleSheet();

  const html = renderToString(
		<ServerStyleContext.Provider value={null}>
  	  <CacheProvider value={cache}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					{
						sheet.collectStyles(
							<RemixServer
								context={remixContext}
								url={request.url}
							/>
						)
					}
				</ThemeProvider>
		  </CacheProvider>
  	</ServerStyleContext.Provider>,
  )

	// Grab the CSS from emotion
  const chunks = extractCriticalToChunks(html);

  let markup = renderToString(
		<ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={cache}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					{
						sheet.collectStyles(
							<RemixServer
								context={remixContext}
								url={request.url}
							/>
						)
					}
				</ThemeProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>,
  )

	const styles = sheet.getStyleTags();

	markup = markup.replace("__STYLES__", styles)

	responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
