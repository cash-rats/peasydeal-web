import * as React from "react";
import { HydratedRouter } from "react-router/dom";
import { hydrateRoot } from "react-dom/client";
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme';
import { ClientStyleContext, ServerStyleContext } from './context'
import type { ServerStyleContextData } from './context'
import createEmotionCache from './createEmotionCache'


interface ClientCacheProviderProps {
	children: React.ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
	const [cache, setCache] = React.useState(createEmotionCache())

	const clientStyleContextValue = React.useMemo(
		() => ({
			reset() {
				setCache(createEmotionCache());
			},
		}),
		[],
	);

	return (
		<ClientStyleContext.Provider value={clientStyleContextValue}>
			<CacheProvider value={cache}>{children}</CacheProvider>
		</ClientStyleContext.Provider>
	)
}

interface ServerStyleProviderProps {
	children: React.ReactNode;
}

function ServerStyleProvider({ children }: ServerStyleProviderProps) {
	const [serverStyleData, setServerStyleData] = React.useState<ServerStyleContextData[] | null>(() => {
		const styleElements = Array.from(document.querySelectorAll<HTMLStyleElement>('style[data-emotion]'));
		if (styleElements.length === 0) {
			return null;
		}

		return styleElements.map((element) => {
			const dataEmotion = element.getAttribute('data-emotion') || '';
			const [key, ...ids] = dataEmotion.split(' ');

			return {
				key: key || 'emotion',
				ids,
				css: element.innerHTML,
			};
		});
	});

	React.useEffect(() => {
		setServerStyleData(null);
	}, []);

	return (
		<ServerStyleContext.Provider value={serverStyleData}>
			{children}
		</ServerStyleContext.Provider>
	);
}

function hydrate() {
	React.startTransition(() => {
		hydrateRoot(
			document,
			<React.StrictMode>
				<ServerStyleProvider>
					<ClientCacheProvider>
						<ThemeProvider theme={theme}>
							<CssBaseline />
							<HydratedRouter />
						</ThemeProvider>
					</ClientCacheProvider>
				</ServerStyleProvider>
			</React.StrictMode>,
		)
	});
}

if (window.requestIdleCallback) {
	window.requestIdleCallback(hydrate);
} else {
	window.setTimeout(hydrate, 1);
}
