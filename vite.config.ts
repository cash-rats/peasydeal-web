import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
  build: { sourcemap: false },
  css: { devSourcemap: false },
  server: {
    port: 5173,
  },
  resolve: {
    alias: [
      { find: /^@mui\/utils\/deepmerge$/, replacement: path.resolve(__dirname, 'app/lib/muiDeepmerge.ts') },
      { find: /^@mui\/system\/createTheme$/, replacement: path.resolve(__dirname, 'app/lib/muiSystemCreateTheme.ts') },
      { find: /^@mui\/system\/styleFunctionSx$/, replacement: path.resolve(__dirname, 'app/lib/muiStyleFunctionSx.ts') },
      { find: /^@mui\/system\/createStyled$/, replacement: path.resolve(__dirname, 'app/lib/muiCreateStyled.ts') },
    ],
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/system',
      '@mui/system/DefaultPropsProvider',
      '@mui/utils',
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
      '@mui/system',
      '@mui/utils',
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
