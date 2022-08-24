import { renderToString } from "react-dom/server";
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { RemixServer } from "@remix-run/react";
import { Response } from "@remix-run/node";
import type { EntryContext, Headers } from "@remix-run/node";
import { ServerStyleSheet } from "styled-components";

import { ServerStyleContext } from "./context";
import createEmotionCache from "./createEmotionCache";

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
		sheet.collectStyles(
			<ServerStyleContext.Provider value={null}>
  		  <CacheProvider value={cache}>
  		    <RemixServer context={remixContext} url={request.url} />
  		  </CacheProvider>
  		</ServerStyleContext.Provider>,
		)
  )

  const chunks = extractCriticalToChunks(html);

  let markup = renderToString(
		<ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>,
  )

	const styles = sheet.getStyleTags();

	//console.log('styles', styles);

	markup = markup.replace("__STYLES__", styles)

	console.log('markup', markup);

	responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
