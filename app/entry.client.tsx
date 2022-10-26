import * as React from "react";
import { RemixBrowser } from "@remix-run/react";

// ISSUE: https://github.com/remix-run/remix/issues/2570
import { hydrateRoot } from "react-dom/client";
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme';
import ClientStyleContext from './context'
import createEmotionCache from './createEmotionCache'

interface ClientCacheProviderProps {
	children: React.ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
	const [cache, setCache] = React.useState(createEmotionCache())

	function reset() {
		setCache(createEmotionCache())
	}

	return (
		<ClientStyleContext.Provider value={{ reset }}>
			<CacheProvider value={cache}>{children}</CacheProvider>
		</ClientStyleContext.Provider>
	)
}

function hydrate() {
	React.startTransition(() => {
		if (process.env.NODE_ENV === 'development') {
			require("react-dom").hydrate(
				<React.StrictMode>
					<ClientCacheProvider>
						<ThemeProvider theme={theme}>
							<CssBaseline />
							<RemixBrowser />
						</ThemeProvider>
					</ClientCacheProvider>
				</React.StrictMode>,
				document,
			);
		} else {
			hydrateRoot(
				document,
				<React.StrictMode>
					<ClientCacheProvider>
						<ThemeProvider theme={theme}>
							<CssBaseline />
							<RemixBrowser />
						</ThemeProvider>
					</ClientCacheProvider>
				</React.StrictMode>,
			)
		}
	});
}

if (window.requestIdleCallback) {
	window.requestIdleCallback(hydrate);
} else {
	window.setTimeout(hydrate, 1);
}
