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

const ESCAPE_LOOKUP: Record<string, string> = {
  '&': '\\u0026',
  '>': '\\u003e',
  '<': '\\u003c',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

const ESCAPE_REGEX = /[&><\u2028\u2029]/g;

function escapeHtml(html: string) {
  return html.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
}

async function renderStreamScripts(stream?: ReadableStream<Uint8Array>) {
  if (!stream) {
    return '';
  }

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let scripts = '';

  while (true) {
    const { value, done } = await reader.read();
    if (value) {
      const chunk = decoder.decode(value, { stream: !done });
      const escapedChunk = escapeHtml(JSON.stringify(chunk));
      scripts += `<script>window.__reactRouterContext.streamController.enqueue(${escapedChunk});</script>`;
    }

    if (done) {
      scripts += `<script>window.__reactRouterContext.streamController.close();</script>`;
      break;
    }
  }

  return scripts;
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext
) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  // Render without the handoff stream twice (once for extraction, once for final markup)
  // so Emotion can collect styles without consuming the stream React Router needs.
  const renderContext = {
    ...entryContext,
    serverHandoffStream: undefined,
  } as EntryContext;

  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ServerRouter context={renderContext} url={request.url} />
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
          <ServerRouter context={renderContext} url={request.url} />
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

  const streamScripts = await renderStreamScripts(entryContext.serverHandoffStream);
  let finalMarkup = markup;
  if (streamScripts) {
    if (finalMarkup.includes('</body>')) {
      finalMarkup = finalMarkup.replace('</body>', `${streamScripts}</body>`);
    } else {
      finalMarkup = `${finalMarkup}${streamScripts}`;
    }
  }

  return new Response(`<!DOCTYPE html>${finalMarkup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
