# Redis Migration Strategy
# ioredis with Upstash Redis

## Current vs Recommended Approach

### ✅ Option 1: Keep ioredis (Recommended)

**Why Keep ioredis?**
- Upstash supports standard Redis protocol
- No code changes needed in your caching logic
- Mature, battle-tested library
- Full Redis feature support
- Just change connection configuration

**What Changes:**
- Connection URL (point to Upstash)
- Connection configuration (TLS settings)
- That's it!

---

## Migration Steps

### Step 1: Get Upstash Connection Details

From your Upstash dashboard, you need:
```
UPSTASH_REDIS_URL=redis://default:your-password@endpoint.upstash.io:port
```

OR separate values:
```
UPSTASH_REDIS_HOST=endpoint.upstash.io
UPSTASH_REDIS_PORT=6379
UPSTASH_REDIS_PASSWORD=your-password
```

### Step 2: Update Environment Variables

Add to `.env.local`:
```bash
# Upstash Redis (using ioredis)
REDIS_HOST=endpoint.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-upstash-password
REDIS_TLS_ENABLED=true

# OR use connection URL:
REDIS_URL=redis://default:password@endpoint.upstash.io:6379
```

### Step 3: Update `app/redis.server.ts`

**Keep the file name as `redis.server.ts`** (no rename needed!)

Update the connection configuration:

```typescript
// app/redis.server.ts
import type { RedisOptions, Redis } from 'ioredis';
import IORedis from 'ioredis';

let redis: Redis;

declare global {
  var __redis__: Redis;
}

// Upstash connection options
const options: RedisOptions = {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  // Upstash requires TLS
  tls: process.env.REDIS_TLS_ENABLED === 'true' ? {} : undefined,
  // Recommended for serverless
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  enableOfflineQueue: false,
  // Upstash-specific (optional)
  family: 6, // Use IPv6 if needed
};

// Serverless-optimized pattern
if (process.env.NODE_ENV === 'production') {
  redis = new IORedis(options);
} else {
  if (!global.__redis__) {
    global.__redis__ = new IORedis(options);
  }
  redis = global.__redis__;
}

// Export for use
export { redis };

// Optional: Export helper with better error handling
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.setex(key, ttlSeconds, serialized);
      } else {
        await redis.set(key, serialized);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  },
};
```

### Step 4: Alternative - Use Connection URL

If you prefer using a connection URL:

```typescript
// app/redis.server.ts
import IORedis from 'ioredis';

let redis: IORedis.Redis;

declare global {
  var __redis__: IORedis.Redis;
}

if (process.env.NODE_ENV === 'production') {
  redis = new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    enableOfflineQueue: false,
  });
} else {
  if (!global.__redis__) {
    global.__redis__ = new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
    });
  }
  redis = global.__redis__;
}

export { redis };
```

### Step 5: No Code Changes Needed!

All your existing code using redis stays the same:

```typescript
// Existing usage works as-is
import { redis } from '~/redis.server';

// In your loaders/actions:
await redis.set('key', 'value');
const value = await redis.get('key');
await redis.setex('key', 3600, 'value'); // with TTL
await redis.del('key');
await redis.exists('key');
```

---

## Comparison: ioredis vs @upstash/redis

### ioredis (Recommended for Your Case)

**Pros:**
- ✅ No code changes needed
- ✅ Full Redis command support
- ✅ Familiar API
- ✅ Mature, battle-tested
- ✅ Works with any Redis (self-hosted, Upstash, AWS, etc.)
- ✅ Connection pooling built-in
- ✅ Pipeline support

**Cons:**
- ⚠️ Maintains persistent TCP connection (fine for serverless)
- ⚠️ Slightly larger package size

**When to use:**
- ✅ You have existing ioredis code
- ✅ You want full Redis feature set
- ✅ You might switch Redis providers later

### @upstash/redis

**Pros:**
- ✅ HTTP-based (serverless-optimized)
- ✅ No connection management needed
- ✅ Works at the edge
- ✅ Smaller package size

**Cons:**
- ⚠️ Different API (requires code changes)
- ⚠️ Limited to Upstash only
- ⚠️ Missing some advanced Redis features

**When to use:**
- ✅ New project
- ✅ Edge runtime requirements
- ✅ Upstash-only deployment

---

## Updated Migration Plan

### ❌ DON'T Do This:

```bash
# Don't uninstall ioredis
npm uninstall ioredis

# Don't rename redis.server.ts
mv app/redis.server.ts app/upstash.server.ts

# Don't install @upstash/redis
npm install @upstash/redis
```

### ✅ DO This Instead:

**Day 1 - Dependencies:**
```bash
# Keep ioredis (already installed)
# No changes needed!

# Optionally update to latest:
npm update ioredis
```

**Day 2 - Configuration:**
```bash
# Update app/redis.server.ts connection config
# Point to Upstash endpoint
# Add TLS configuration
# Keep all existing code using redis
```

**Add to `.env.local`:**
```bash
# Upstash Redis (via ioredis)
REDIS_HOST=your-endpoint.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-password
REDIS_TLS_ENABLED=true
```

**Update `app/redis.server.ts`:**
```typescript
const options: RedisOptions = {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS_ENABLED === 'true' ? {} : undefined,
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  enableOfflineQueue: false,
};
```

That's it! No other changes needed.

---

## Testing Checklist

After updating connection configuration:

### Local Testing
```bash
# Start dev server
npm run dev

# Test Redis operations:
```

**Check these features:**
- [ ] Category caching works
- [ ] Product list caching works
- [ ] Session storage works (if using Redis sessions)
- [ ] No Redis connection errors in console
- [ ] Data persists correctly

### Upstash Dashboard Testing
- [ ] Go to Upstash dashboard
- [ ] Check "Data Browser" tab
- [ ] Verify keys are being created
- [ ] Check request count increasing
- [ ] Monitor for errors

### Production Testing
- [ ] Add Upstash environment variables to Vercel
- [ ] Deploy to Vercel
- [ ] Test caching works in production
- [ ] Monitor Upstash metrics
- [ ] Check Vercel logs for Redis errors

---

## Troubleshooting

### Issue: Connection timeout

**Error:**
```
Error: Connection timeout
```

**Solution:**
```typescript
// Add timeout settings
const options: RedisOptions = {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {},
  connectTimeout: 10000, // 10 seconds
  maxRetriesPerRequest: 3,
};
```

### Issue: TLS certificate errors

**Error:**
```
Error: self signed certificate
```

**Solution:**
```typescript
const options: RedisOptions = {
  // ... other options
  tls: {
    rejectUnauthorized: false, // Only for development
  },
};
```

For production, use proper TLS:
```typescript
tls: process.env.NODE_ENV === 'production' ? {} : undefined,
```

### Issue: Too many connections

**Error:**
```
Error: max number of clients reached
```

**Solution:**
Use the global pattern already in your code:
```typescript
if (!global.__redis__) {
  global.__redis__ = new IORedis(options);
}
redis = global.__redis__;
```

This reuses the connection in development.

### Issue: Command not supported

Some Redis commands might not be supported by Upstash. Check:
https://upstash.com/docs/redis/features/rediscompatibility

**Common supported commands:**
- ✅ GET, SET, DEL
- ✅ SETEX, EXPIRE, TTL
- ✅ EXISTS, KEYS
- ✅ HGET, HSET, HDEL
- ✅ LPUSH, RPUSH, LPOP, RPOP
- ✅ ZADD, ZRANGE, ZREM

---

## Environment Variables Reference

### Development (.env.local)
```bash
# Upstash Redis
REDIS_HOST=endpoint.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-dev-password
REDIS_TLS_ENABLED=true

# OR use connection URL
REDIS_URL=redis://default:password@endpoint.upstash.io:6379
```

### Production (Vercel Dashboard)
```bash
# Add these in Vercel Dashboard → Environment Variables
REDIS_HOST=endpoint.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-prod-password
REDIS_TLS_ENABLED=true
```

---

## Session Storage with Redis

If you're using Redis for session storage (via `remix-redis-session`):

### Option 1: Keep Redis Sessions (Recommended)

Update `app/sessions/create_redis_session.ts`:
```typescript
import { createCookieSessionStorage } from 'react-router';
import { redis } from '~/redis.server';

// Your existing redis session code works as-is
// Just update the import from @remix-run to react-router
```

### Option 2: Switch to Cookie Sessions (Simpler)

If not already using, you have this in `app/session.server.ts`:
```typescript
import { createCookieSessionStorage } from "react-router";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
});
```

This works great for serverless and doesn't need Redis.

---

## Summary

### For Your Migration:

✅ **KEEP ioredis** - Don't uninstall
✅ **KEEP redis.server.ts** - Don't rename
✅ **UPDATE connection config only** - Point to Upstash
✅ **ADD TLS settings** - Upstash requires TLS
✅ **NO code changes** - All existing redis usage works

### Changes Required:

1. **Environment variables** - Add Upstash credentials
2. **Connection config** - Update `app/redis.server.ts` connection options
3. **That's it!** - Everything else stays the same

### Files Modified:

```
📝 app/redis.server.ts (update connection config)
📝 .env.local (add Upstash credentials)
```

### Files Unchanged:

```
✅ All files using redis (no changes)
✅ All caching logic (no changes)
✅ All session code (no changes)
```

This is the **minimal change approach** for Redis migration.
