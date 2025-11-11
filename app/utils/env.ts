import { z } from 'zod';

/**
 * Environment variable schema with validation and default values
 */
const envSchema = z.object({
  // Core configuration
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).default('development'),
  DOMAIN: z.string().default('https://staging.peasydeal.com'),
  SESSION_SECRET: z.string().min(1, 'SESSION_SECRET is required'),

  // API Endpoints
  MYFB_ENDPOINT: z.string().default(''),
  PEASY_DEAL_ENDPOINT: z.string().default('https://stagingapi.peasydeal.com'),

  // CDN
  CDN_URL: z.string().default('https://cdn.peasydeal.com'),

  // Redis (required for server)
  REDIS_HOST: z.string(),
  REDIS_USER: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_PORT: z.string().transform((val: string) => Number(val) || 6379).default(6379),
  REDIS_DB: z.string().transform((val: string) => Number(val) || 0).default(0),
  REDIS_SESSION_TTL: z.string().transform((val: string) => Number(val) || 295200).default(295200),

  // Caching
  CATEGORY_CACHE_TTL: z.string().transform((val: string) => Number(val) || 43200).default(43200),

  // Payment - PayPal
  PAYPAL_CLIENT_ID: z.string(),
  PAYPAL_CURRENCY_CODE: z.string(),

  // Payment - Stripe
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_PAYMENT_RETURN_URI: z.string().optional(),
  STRIPE_CURRENCY_CODE: z.string().default('GBP'),

  // Google Services
  GOOGLE_MAP_API_KEY: z.string().default(''),
  GOOGLE_TAG_ID: z.string().optional(),

  // Contentful CMS
  CONTENTFUL_SPACE_ID: z.string().optional(),
  CONTENTFUL_ACCESS_TOKEN: z.string().optional(),

  // Analytics
  RUDDER_STACK_KEY: z.string().default(''),
  RUDDER_STACK_URL: z.string().default(''),

  // Algolia Search
  ALGOLIA_APP_ID: z.string().default(''),
  ALGOLIA_APP_WRITE_KEY: z.string().default(''),
  ALGOLIA_INDEX_NAME: z.string().default(''),

  // Google Cloud Storage
  GCS_KEY_NAME: z.string().default('peasydeal-master-key.json'),
  GCS_BUCKET_NAME: z.string().default('GCS_BUCKET_NAME'),

  // Cloudflare R2
  R2_ACCOUNT_ID: z.string().default(''),
  R2_ACCESS_KEY_ID: z.string().default(''),
  R2_SECRET_ACCESS_KEY: z.string().default(''),
  R2_BUCKET_NAME: z.string().default(''),
});

// Infer the TypeScript type from the Zod schema
export type Env = z.infer<typeof envSchema>;

/**
 * Load and validate environment variables
 *
 * @returns Validated environment object or throws if validation fails
 */
export function getEnv(): Env {
  let rawEnv: any;
  // Detect server vs client
  if (typeof window === 'undefined') {
    // Server: use process.env
    rawEnv = process.env;
  } else {
    // Client: envs must be exposed on window.__ENV (must be injected at build/runtime)

    rawEnv = (window as any).ENV || {};
    // Note: client envs must be injected to window.ENV at build/runtime for this to work.
    // Example: <script>window.ENV = { API_URL: '...' };</script>
  }
  const result = envSchema.safeParse(rawEnv);

  // Handle validation failure (e.g., in browser before window.ENV is available)
  if (!result.success) {
    // In browser context, return a minimal safe object to prevent crashes
    if (typeof window !== 'undefined') {
      return {
        NODE_ENV: 'development',
        VERCEL_ENV: 'development',
        DOMAIN: 'https://staging.peasydeal.com',
        SESSION_SECRET: '',
        MYFB_ENDPOINT: '',
        PEASY_DEAL_ENDPOINT: 'https://stagingapi.peasydeal.com',
        CDN_URL: 'https://cdn.peasydeal.com',
        REDIS_HOST: '',
        REDIS_USER: '',
        REDIS_PASSWORD: '',
        REDIS_PORT: 6379,
        REDIS_DB: 0,
        REDIS_SESSION_TTL: 295200,
        CATEGORY_CACHE_TTL: 43200,
        PAYPAL_CLIENT_ID: '',
        PAYPAL_CURRENCY_CODE: '',
        STRIPE_CURRENCY_CODE: 'GBP',
        GOOGLE_MAP_API_KEY: '',
        RUDDER_STACK_KEY: '',
        RUDDER_STACK_URL: '',
        ALGOLIA_APP_ID: '',
        ALGOLIA_APP_WRITE_KEY: '',
        ALGOLIA_INDEX_NAME: '',
        GCS_KEY_NAME: 'peasydeal-master-key.json',
        GCS_BUCKET_NAME: 'GCS_BUCKET_NAME',
        R2_ACCOUNT_ID: '',
        R2_ACCESS_KEY_ID: '',
        R2_SECRET_ACCESS_KEY: '',
        R2_BUCKET_NAME: '',
      } as Env;
    }
    // On server, throw error if validation fails
    throw new Error(`Environment validation failed: ${JSON.stringify(result.error.format())}`);
  }

  const envData = result.data;
  const missingVars: string[] = [];

  // Check each environment variable for empty strings
  envData && Object.entries(envData).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() === '') {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables (empty values detected):');
    missingVars.forEach(varName => {
      console.error(`  • ${varName}: is empty (missing)`);
    });
    console.error('⚠️  Application will continue with default empty values');
  }

  return envData;
}

// Lazy initialization to avoid module-level errors
let _env: Env | null = null;
if (!_env) {
  _env = getEnv();
}

export const env = _env;

// Helper functions for environment checking (now as getters to avoid module-level execution)
export const isProd = () => env.VERCEL_ENV === 'production';
export const isStaging = () => env.VERCEL_ENV === 'preview';
export const isPreview = () => isStaging();
export const isDev = () => !isProd() && !isStaging();

// Legacy compatibility exports
export const envs = getEnv();
