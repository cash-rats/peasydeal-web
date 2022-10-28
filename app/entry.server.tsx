import { renderToString } from "react-dom/server";
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { RemixServer } from "@remix-run/react";
import { Response } from "@remix-run/node";
import type { EntryContext, Headers } from "@remix-run/node";

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

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

  const html = renderToString(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RemixServer
          context={remixContext}
          url={request.url}
        />
      </ThemeProvider>
    </CacheProvider>,
  )

  // Grab the CSS from emotion
  const { styles } = extractCriticalToChunks(html);


  let markup = renderToString(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RemixServer
          context={remixContext}
          url={request.url}
        />
      </ThemeProvider>
    </CacheProvider>
  )

  let stylesHTML = '';

  styles.forEach(({ key, ids, css }) => {
    const emotionKey = `${key} ${ids.join(' ')}`;
    const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`;
    stylesHTML = `${stylesHTML}${newStyleTag}`;
  });

  markup = markup.replace(
    /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
    `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`,
  )

  // markup = markup.replace("__STYLES__", '<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-635bba2fbbd28044"></script>');
  markup = markup.replace("__STYLES__", '<script type="text/javascript" src="https://platform-api.sharethis.com/js/sharethis.js#property=635a37810e0d03001fe8c1e9&product=inline-share-buttons" async></script>');
  console.log('debug markup', markup);

  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
