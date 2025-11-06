# Environment Variables Migration Plan

## Executive Summary

This document outlines the migration strategy from the current manual environment variable handling to a Zod-based validation system, similar to the reference implementation. The migration will improve type safety, provide runtime validation, and establish a single source of truth for environment configuration.

## Current Implementation Analysis

### File: `app/utils/get_env_source.ts`

**Key Characteristics:**
- Manual TypeScript type definitions (`AppConfig` interface)
- Browser/server environment detection (`window.ENV` vs `process.env`)
- Individual `getENV()` calls with inline default values
- No validation or type coercion
- Export of individual constants via `envs` object
- Helper functions: `isStaging()`, `isDev()`, `isProd()`
- ~41 files importing from this module

**Usage Patterns Found:**
```typescript
// Most common pattern
import { envs } from '~/utils/get_env_source';

// With helper functions
import { envs, isProd, isStaging, isDev } from '~/utils/get_env_source';

// Loader usage - envs passed to client
export async function loader({ request }: LoaderArgs) {
  return json({ envs, /* other data */ });
}
```

## Target Implementation Analysis

### Zod-Based Approach

**Key Advantages:**
1. **Runtime Validation**: Catches missing/invalid env vars at startup
2. **Type Safety**: Automatic TypeScript type inference from schema
3. **Type Coercion**: Transforms string values to appropriate types (numbers, booleans)
4. **Default Values**: Centralized in schema definition
5. **Clear Documentation**: Schema serves as living documentation
6. **Better DX**: Immediate feedback on configuration issues

**Core Pattern:**
```typescript
const envSchema = z.object({
  VAR_NAME: z.string().default("default_value"),
  PORT: z.string().transform(val => Number(val) || 5432).default("5432"),
});

export type Env = z.infer<typeof envSchema>;
export const env = getEnv(); // Validates and returns typed object
```

## Migration Strategy

### Phase 1: Dependencies & Setup

**Action Items:**
1. Install Zod dependency
   ```bash
   npm install zod
   # or
   yarn add zod
   ```

2. Create new file: `app/utils/env.ts` (keeping old file temporarily for comparison)

### Phase 2: Schema Definition

**Create Zod Schema:**

Map all 32 environment variables from current `AppConfig` to Zod schema:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Core configuration
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  DOMAIN: z.string().default('https://staging.peasydeal.com'),

  // API Endpoints
  MYFB_ENDPOINT: z.string().default(''),
  PEASY_DEAL_ENDPOINT: z.string().default('https://stagingapi.peasydeal.com'),

  // CDN
  CDN_URL: z.string().default('https://cdn.peasydeal.com'),

  // Redis (required for server)
  REDIS_HOST: z.string(),
  REDIS_USER: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_PORT: z.string().transform(val => Number(val) || 6379).default('6379'),
  REDIS_DB: z.string().transform(val => Number(val) || 0).default('0'),
  REDIS_SESSION_TTL: z.string().transform(val => Number(val) || 295200).default('295200'),

  // Caching
  CATEGORY_CACHE_TTL: z.string().transform(val => Number(val) || 43200).default('43200'),

  // Payment - PayPal
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CURRENCY_CODE: z.string().optional(),

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

export type Env = z.infer<typeof envSchema>;
```

**Key Decisions:**
- Mark Redis vars as required (no defaults) - critical infrastructure
- Keep optional fields for payment/CMS integrations
- Transform numeric strings to numbers
- Use enum for NODE_ENV to catch typos

### Phase 3: Environment Detection Logic

**Challenge:** The current implementation supports both browser (`window.ENV`) and server (`process.env`) environments.

**Solution Approach:**

```typescript
// Server-side validation (app/utils/env.ts)
export function getEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    result.error.issues.forEach(issue => {
      console.error(`  • ${issue.path.join('.')}: ${issue.message}`);
    });
    throw new Error('Environment validation failed');
  }

  return result.data;
}

export const env = getEnv();

// Helper functions
export const isStaging = env.NODE_ENV === 'staging';
export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
```

**Client-Side Access:**

The current pattern passes `envs` through loaders to the client. This pattern should be maintained:

```typescript
// In root.tsx loader
export async function loader({ request }: LoaderArgs) {
  const gaSessionID = await storeDailySession();
  return json({
    env, // Instead of envs
    gaSessionID,
  });
}

// Client components access via useLoaderData()
const { env } = useLoaderData<typeof loader>();
```

### Phase 4: Migration Execution

**Files to Update (41 total):**

1. **Server files** (~35 files):
   ```typescript
   // Old
   import { envs } from '~/utils/get_env_source';
   const endpoint = envs.PEASY_DEAL_ENDPOINT;

   // New
   import { env } from '~/utils/env';
   const endpoint = env.PEASY_DEAL_ENDPOINT;
   ```

2. **Root loader** (`app/root.tsx`):
   ```typescript
   // Old
   import { envs, isProd, isStaging, isDev } from '~/utils/get_env_source';
   return json({ envs });

   // New
   import { env, isProd, isStaging, isDev } from '~/utils/env';
   return json({ env });
   ```

3. **Client components accessing env**:
   ```typescript
   // Old
   const data = useLoaderData<typeof loader>();
   const domain = data.envs.DOMAIN;

   // New - should still work if loader returns env
   const data = useLoaderData<typeof loader>();
   const domain = data.env.DOMAIN;
   ```

**Migration Order:**
1. Create new `env.ts` file
2. Update `app/root.tsx` loader to use new system
3. Update server files (`.server.ts` files first)
4. Update React components that access env
5. Remove old `get_env_source.ts` file

### Phase 5: Testing Strategy

**Pre-Migration Testing:**
1. Document current behavior in dev/staging/prod environments
2. Capture current env var values used

**Post-Migration Validation:**
1. **Startup validation**: Ensure app starts without validation errors
2. **Runtime checks**:
   - Redis connections work (validates Redis env vars)
   - Payment flows work (Stripe/PayPal keys)
   - Image delivery works (R2/GCS credentials)
   - Search works (Algolia keys)
3. **Type checking**: Run TypeScript compiler to catch type errors
4. **Build verification**: Ensure build succeeds

**Test Cases:**
```bash
# Missing required var
unset REDIS_HOST
npm run dev
# Should fail with clear error message

# Invalid NODE_ENV
export NODE_ENV=unknown
npm run dev
# Should fail validation

# Valid configuration
export NODE_ENV=development
export REDIS_HOST=localhost
# ... other vars
npm run dev
# Should start successfully
```

### Phase 6: Benefits Realization

**Immediate Benefits:**
1. ✅ Catch configuration errors at startup, not runtime
2. ✅ Type safety for all env access (autocomplete, refactoring)
3. ✅ Self-documenting configuration (schema as documentation)
4. ✅ Consistent type handling (no more manual Number() conversions)

**Long-term Benefits:**
1. ✅ Easier onboarding (clear list of required env vars)
2. ✅ Safer deployments (validation prevents misconfiguration)
3. ✅ Better error messages (Zod provides detailed validation errors)

## Risk Assessment

### Low Risk
- ✅ Additive change (new file created first)
- ✅ Can maintain parallel systems during migration
- ✅ Types remain compatible (object with same keys)

### Medium Risk
- ⚠️ Client-side access pattern change (`envs` → `env`)
  - **Mitigation**: Search and replace is straightforward
- ⚠️ Need to test all integration points
  - **Mitigation**: Systematic file-by-file migration with testing

### Considerations
- 🔍 **Browser vs Server**: Zod validation only runs on server. Client gets pre-validated env object through loaders.
- 🔍 **Sensitive Data**: Should NOT pass secrets to client (already handled via selective exposure in loaders)
- 🔍 **Type Changes**: Some values change from `string | undefined` to `string` (with defaults). This is safer but may affect optional chaining.

## Rollback Plan

If issues arise:

1. **Quick Rollback**: Revert imports back to `get_env_source`
   ```bash
   git revert <commit-hash>
   ```

2. **Partial Rollback**: Keep both systems running
   ```typescript
   // Temporary compatibility
   export { env as envs } from '~/utils/env';
   ```

## Implementation Checklist

- [ ] Install Zod dependency
- [ ] Create `app/utils/env.ts` with schema
- [ ] Test schema validation with current .env file
- [ ] Update `app/root.tsx` to use new env system
- [ ] Update all server files (`.server.ts` - 35 files)
- [ ] Update client components accessing env (6 files)
- [ ] Update session files (2 files)
- [ ] Run TypeScript type checking
- [ ] Test application startup
- [ ] Test key features (Redis, payments, images, search)
- [ ] Remove old `app/utils/get_env_source.ts`
- [ ] Update documentation/README if needed
- [ ] Create/update `.env.example` based on schema

## Timeline Estimate

- **Phase 1 (Setup)**: 15 minutes
- **Phase 2 (Schema)**: 30 minutes
- **Phase 3 (Logic)**: 30 minutes
- **Phase 4 (Migration)**: 2-3 hours (41 files)
- **Phase 5 (Testing)**: 1 hour
- **Total**: ~5 hours

## Success Criteria

- ✅ All files successfully import from new env system
- ✅ TypeScript compilation succeeds with no errors
- ✅ Application starts without validation errors
- ✅ All integration tests pass
- ✅ No regression in functionality
- ✅ Clear error messages for missing/invalid env vars

## Open Questions

1. **Deployment**: Are env vars set via .env files or deployment platform (Vercel, etc)?
   - Need to ensure deployment env vars are compatible with schema

2. **Environment-specific validation**: Should some vars only be required in production?
   ```typescript
   // Example: Stripe required in prod, optional in dev
   STRIPE_PUBLIC_KEY: z.string()
     .optional()
     .refine(val => NODE_ENV !== 'production' || val, {
       message: 'STRIPE_PUBLIC_KEY required in production'
     })
   ```

3. **Secrets exposure**: Confirm which vars should/shouldn't be sent to client
   - Current pattern: All vars in `envs` object passed to client
   - Should create separate `publicEnv` and `privateEnv`?

## Conclusion

This migration will significantly improve the robustness and maintainability of environment configuration. The Zod-based approach provides runtime safety while maintaining TypeScript's compile-time guarantees. The migration path is straightforward with low risk and clear rollback options.
