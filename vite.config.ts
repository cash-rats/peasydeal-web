// Vercel's npm sometimes omits Rollup's optional native bindings; forcing
// the JavaScript fallback keeps builds stable across environments.
process.env.ROLLUP_SKIP_NODEJS_NATIVE = process.env.ROLLUP_SKIP_NODEJS_NATIVE ?? '1';

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: false
  },
  css: {
    devSourcemap: false
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@algolia/autocomplete-core',
      '@algolia/autocomplete-js',
      '@algolia/autocomplete-plugin-query-suggestions',
      '@algolia/autocomplete-plugin-recent-searches',
      '@algolia/autocomplete-plugin-algolia-insights',
      'search-insights',
    ],
  },
  ssr: {
    noExternal: [
      '@emotion/cache',
      '@emotion/react',
      '@emotion/server',
      '@emotion/styled',
      '@emotion/memoize',
      '@emotion/weak-memoize',
      '@emotion/sheet',
      '@emotion/utils',
      '@mui/material',
      '@chakra-ui/react',
      '@algolia/autocomplete-js',
      '@algolia/autocomplete-core',
      '@algolia/autocomplete-shared',
      '@algolia/autocomplete-preset-algolia',
      '@algolia/autocomplete-plugin-query-suggestions',
      '@algolia/autocomplete-plugin-recent-searches',
      '@algolia/autocomplete-plugin-algolia-insights',
      '@algolia/autocomplete-theme-classic',
      'algoliasearch',
    ],
  },
});
