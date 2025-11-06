import { renderToString } from "react-dom/server";
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { ServerRouter } from "react-router";
import type { EntryContext } from "react-router";

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { ServerStyleContext } from './context';
import createEmotionCache from "./createEmotionCache";
import theme from './theme';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext
) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ServerRouter
            context={entryContext}
            url={request.url}
          />
        </ThemeProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>,
  )

  // Grab the CSS from emotion
  const { styles } = extractCriticalToChunks(html);

  let markup = renderToString(
    <ServerStyleContext.Provider value={styles}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ServerRouter
            context={entryContext}
            url={request.url}
          />
        </ThemeProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>,
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

  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}