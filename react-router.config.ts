import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  presets: [vercelPreset()],
  serverDependenciesToBundle: [
    'yet-another-react-lightbox',
    'yet-another-react-lightbox/plugins/thumbnails'
  ],
} satisfies Config;
