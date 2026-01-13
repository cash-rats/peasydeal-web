import { z } from 'zod';

/**
 * Public (browser-safe) environment variables.
 *
 * Anything declared here can be serialized into `window.ENV` in `app/root.tsx`.
 * Do NOT add secrets (API secret keys, service role keys, session secrets, etc.).
 */
const publicEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).default('development'),

  DOMAIN: z.string().default('https://staging.peasydeal.shop'),
  PEASY_DEAL_ENDPOINT: z.string().default('https://stagingapi.peasydeal.com'),
  CDN_URL: z.string().default('https://cdn.peasydeal.com'),

  CATEGORY_CACHE_TTL: z.coerce.number().default(43200),

  PAYPAL_CLIENT_ID: z.string().default(''),
  PAYPAL_CURRENCY_CODE: z.string().default(''),

  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_CURRENCY_CODE: z.string().default('GBP'),

  GOOGLE_TAG_ID: z.string().optional(),

  MAPBOX_BOX_ACCESS_TOKEN: z.string().default(''),

  // Analytics
  RUDDERSTACK_WRITE_KEY: z.string().optional(),
  RUDDERSTACK_DATAPLANE_URL: z.string().optional(),

  // Algolia (note: `ALGOLIA_APP_WRITE_KEY` may be sensitive; keep here only if intentionally used client-side)
  ALGOLIA_APP_ID: z.string().default(''),
  ALGOLIA_APP_WRITE_KEY: z.string().default(''),
  ALGOLIA_INDEX_NAME: z.string().default(''),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

function validateEnv(rawEnv: unknown): PublicEnv {
  const result = publicEnvSchema.safeParse(rawEnv);

  if (!result.success) {
    console.error('❌ Public env validation failed:');
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.') || '(root)';
      console.error(`  • ${path}: ${issue.message}`);
    });
    throw new Error('Public env validation failed. See logs for details.');
  }

  const envData = result.data;
  const missingVars: string[] = [];

  Object.entries(envData).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() === '') {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing public environment variables (empty values detected):');
    missingVars.forEach(varName => {
      console.error(`  • ${varName}: is empty (missing)`);
    });
    console.error('⚠️  Application will continue with default empty values');
  }

  return envData;
}

/**
 * Returns public env values.
 *
 * - On the server: reads `process.env` (but only validates/returns the public subset).
 * - In the browser: reads `window.ENV` (injected by `app/root.tsx`).
 */
export function getEnv(): PublicEnv {
  const rawEnv =
    typeof window === 'undefined'
      ? process.env
      : ((window as unknown as { ENV?: Record<string, unknown> }).ENV ?? {});

  return validateEnv(rawEnv);
}

// Backwards-compatible exports (many modules use `env` / `envs` today).
export const env = getEnv();
export const envs = env;

export const isProd = () => env.VERCEL_ENV === 'production';
export const isStaging = () => env.VERCEL_ENV === 'preview';
export const isPreview = () => isStaging();
export const isDev = () => !isProd() && !isStaging();

