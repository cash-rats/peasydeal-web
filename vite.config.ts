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
    ],
  },
});
