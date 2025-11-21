# Remix-Image SSR Fix Plan

**Date:** 2025-11-11
**Issue:** SSR "exports is not defined" error with remix-image package
**Status:** ✅ MIGRATED TO LOCAL react-router-image PACKAGE
**Last Updated:** 2025-11-17 12:32 PM

---

## ⚠️ UPDATE: Attempted Fix Failed

**What We Tried:**
1. Updated imports from `@remix-run/server-runtime` to `react-router` ✅
2. Added `'remix-image'` to `ssr.noExternal` in vite.config.ts ✅

**Result:** ❌ **SAME ERROR PERSISTS**

```
12:26:19 PM [vite] Internal server error: exports is not defined
at eval (/node_modules/remix-image/build/index.js:3:49)
```

**Conclusion:** The `remix-image` package has fundamental ESM/CommonJS incompatibility with Vite SSR that **cannot be fixed through configuration**. Migration to an alternative solution is required.

**New Strategy (superseded):** Build custom OptimizedImage component while preserving existing 415 lines of Sharp/R2 infrastructure.

**Final Strategy (implemented):** Replace the unmaintained `remix-image` dependency with a minimal, vendored `react-router-image` module (now under `app/lib/react-router-image`) designed for React Router 7 and Node 22, while keeping the existing Sharp/R2/CDN loader flow intact.

---

## Problem Summary

### The Error
```
Error when evaluating SSR module virtual:react-router/server-build: exports is not defined
at eval (/node_modules/remix-image/build/index.js:3:49)
```

### Root Cause
The project has a catch-22 situation with `remix-image`:

1. **WITH** `remix-image` in `ssr.noExternal`:
   - Vite tries to bundle the CommonJS package for SSR
   - The CommonJS `exports` object becomes undefined in ESM context
   - Error: "exports is not defined"

2. **WITHOUT** `remix-image` in `ssr.noExternal`:
   - The `MimeType` named export fails to resolve during SSR
   - ESM/CommonJS interop issues when treated as external dependency
   - Error at RegularCardWithActionButton.tsx:178

### Why This Happens
- `remix-image` v1.4.0 is a CommonJS package built for Remix v1.x
- The package has ESM/CommonJS interop issues with modern Vite + React Router 7 SSR
- React Router 7 migration changed import paths and module resolution

---

## Current System Analysis

### Remix-Image Usage in Project

**Total Files:** 10 TypeScript/TSX files importing from `remix-image`

**Components Using Image Component:**
1. `/app/components/ProductCard/RegularCardWithActionButton.tsx`
2. `/app/components/Algolia/components/HitThumbnail.tsx`
3. `/app/components/Carousel/CarouselMinimal.tsx`
4. `/app/routes/tracking/components/TrackingOrderInfo/components/ReviewModal/components/ReviewForm.tsx`
5. `/app/routes/__index/events/win-a-free-surprise-gift.tsx`

**Custom Loader Infrastructure:**
- `/app/routes/__index/remix-image/index.tsx` - Main loader route (61 lines)
- `/app/routes/__index/remix-image/transformer.ts` - Sharp transformer (183 lines)
- `/app/routes/__index/remix-image/r2.ts` - Cloudflare R2 uploader (42 lines)
- `/app/routes/__index/remix-image/mimes.ts` - MIME type definitions (26 lines)
- `/app/routes/__index/remix-image/response.ts` - Response helpers (30 lines)

**Total Custom Code:** ~415 lines

### Current Architecture

**Two-Tier Image Optimization System:**

1. **Tier 1 - CDN First (Primary):**
   - Checks Cloudflare CDN for pre-transformed image
   - Pattern: `https://CDN_URL/webp/w400_h400/image.webp`
   - Returns immediately if found (max-age: 1 year)

2. **Tier 2 - On-the-Fly Transformation (Fallback):**
   - Uses Sharp to resize, optimize, and convert to WebP
   - Uploads result to Cloudflare R2
   - Returns transformed image to client
   - Future requests hit CDN (Tier 1)

**Features in Use:**
- Lazy loading with blur placeholders
- Progressive loading states
- WebP format conversion
- Responsive image sizes (274x274, 100x100, 75x75, 30x30)
- Aspect ratio preservation
- Memory caching

---

## Solution Strategy (UPDATED)

### ~~Decision: Keep remix-image (Minimal Changes)~~ ❌ FAILED

**Original Rationale:**
- ~~Low risk, low effort solution~~
- ~~Preserves 415 lines of working custom code~~
- ~~Only ~7 lines of code need changes~~

**Why It Failed:**
- remix-image has fundamental ESM/CommonJS issues
- Configuration changes cannot resolve the core problem
- Package is unmaintained (last update 2022)
- Incompatible with modern Vite SSR module handling

### NEW Decision (superseded): Migrate to Custom Native Solution

This was the initial mitigation plan but was not ultimately implemented because a better option emerged: forking `remix-image` into a local package tailored to React Router 7 + Node 22.

### Final Decision: Fork remix-image → Vendored react-router-image Module ✅

**Why This is Now the Best Choice:**
1. **Keep Infrastructure** – All 415 lines of Sharp/R2/CDN code and the existing `/remix-image` loader route stay intact.
2. **Minimal Surface Area** – We only implement the parts actually used:
   - `imageLoader` (server loader)
   - `MemoryCache` (in-memory cache)
   - Types: `LoaderConfig`, `TransformOptions`, `MimeType`, etc.
3. **No Native SQLite** – We drop disk-based cache (`@next-boost/hybrid-disk-cache` / `better-sqlite3`), avoiding Node 22 native build issues.
4. **React Router 7-native** – The new package uses the Fetch API (`Request`/`Response`) and integrates directly with React Router loaders.
5. **Repo-local** – Implemented under `app/lib/react-router-image` and imported via local aliases, so deployments don’t depend on building a workspace package.

**Migration Strategy:**
- Build custom `<OptimizedImage>` component (~200 lines)
- Replace imports in 11 component files
- Keep entire `/remix-image` loader route unchanged
- Total effort: 1-1.5 days

---

## Migration Alternatives Research

We researched 4 alternatives to replace remix-image. See detailed comparison below.

### Option 1: Custom Native Solution ⭐ RECOMMENDED

**Migration Time:** 1-1.5 days | **Risk:** Low | **Infrastructure Changes:** None

**What It Is:**
Build a custom React component that replicates remix-image's API while using your existing `/remix-image` loader route.

**Architecture:**
```
Custom <OptimizedImage> Component → Existing /remix-image route → Sharp → R2 → CDN
```

**Code Example:**
```tsx
// Before (remix-image)
import Image, { MimeType } from 'remix-image';
<Image
  blurDataURL={placeholder}
  placeholder='blur'
  loaderUrl='/remix-image'
  options={{ contentType: MimeType.WEBP }}
  responsive={[{ size: { width: 274, height: 274 }}]}
/>

// After (custom component)
import { OptimizedImage as Image } from '~/components/OptimizedImage';
<Image
  blurDataURL={placeholder}
  placeholder='blur'
  options={{ contentType: 'image/webp' }}
  responsive={[{ size: { width: 274, height: 274 }}]}
/>
```

**Pros:**
- ✅ Fastest migration (1-1.5 days)
- ✅ Zero infrastructure changes
- ✅ 100% feature preservation
- ✅ Drop-in replacement - same API
- ✅ Full control over implementation
- ✅ No new dependency issues
- ✅ Keep all 415 lines of transformation code

**Cons:**
- ⚠️ Custom code to maintain (~200 lines)
- ⚠️ No automatic library updates

---

### Option 2: @unpic/react

**Migration Time:** 2-3 days | **Risk:** Medium | **Infrastructure Changes:** None

**What It Is:**
Modern image component by Astro team. Auto-generates responsive images.

**Installation:**
```bash
npm install @unpic/react
```

**Usage:**
```tsx
import { Image } from '@unpic/react/base';

const customTransformer = ({ url, width, height }) => {
  return `/remix-image?src=${url}&width=${width}&height=${height}&contentType=image/webp`;
};

<Image
  src={productImage}
  width={274}
  height={274}
  transformer={customTransformer}
/>
```

**Pros:**
- ✅ Modern, actively maintained
- ✅ Automatic responsive images
- ✅ TypeScript native

**Cons:**
- ❌ No blur placeholders (need custom implementation)
- ❌ Different API (more code changes)
- ⚠️ Custom transformer needed
- ⚠️ Longer migration (2-3 days)

---

### Option 3: react-lazy-load-image-component

**Migration Time:** 2-3 days | **Risk:** Medium | **Infrastructure Changes:** None

**What It Is:**
Popular lazy loading library (1.4M+ weekly downloads).

**Installation:**
```bash
npm install react-lazy-load-image-component
```

**Usage:**
```tsx
import { LazyLoadImage } from 'react-lazy-load-image-component';

<LazyLoadImage
  src={`/remix-image?src=${url}&width=274&height=274`}
  effect="blur"
  placeholderSrc={placeholder}
/>
```

**Pros:**
- ✅ Good lazy loading
- ✅ Built-in blur effect

**Cons:**
- ❌ No automatic responsive images
- ⚠️ Manual srcset implementation needed
- ⚠️ 2-3 days migration

---

### Option 4: Plain `<img>` with Helpers

**Migration Time:** 1 day | **Risk:** Low | **Infrastructure Changes:** None

**What It Is:**
Simplest solution - use native `<img>` with helper functions.

**Usage:**
```tsx
function getImageUrl(src, width, height) {
  return `/remix-image?src=${src}&width=${width}&height=${height}&contentType=image/webp`;
}

<img
  src={getImageUrl(url, 274, 274)}
  srcSet={`${getImageUrl(url, 137, 137)} 137w, ${getImageUrl(url, 274, 274)} 274w`}
  loading="lazy"
/>
```

**Pros:**
- ✅ Zero dependencies
- ✅ Simplest solution
- ✅ Perfect SSR

**Cons:**
- ❌ No blur placeholders
- ❌ Only native lazy loading
- ⚠️ Manual srcset for each usage

---

## Comparison Matrix

| Feature | Custom Native ⭐ | @unpic/react | react-lazy-load | Plain `<img>` |
|---------|------------------|--------------|-----------------|---------------|
| **Migration Time** | 1-1.5 days | 2-3 days | 2-3 days | 1 day |
| **Risk Level** | Low | Medium | Medium | Low |
| **SSR Compatible** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Blur Placeholders** | ✅ Built-in | ❌ Manual | ✅ CSS-based | ❌ Manual |
| **Lazy Loading** | ✅ IntersectionObserver | ✅ Native | ✅ IntersectionObserver | ⚠️ Native only |
| **Responsive Images** | ✅ Auto srcset | ✅ Auto srcset | ❌ Manual | ⚠️ Manual |
| **Same API** | ✅ Drop-in | ❌ Different | ❌ Different | ❌ Different |
| **New Dependencies** | 0 | 1 | 1 | 0 |
| **Keeps Loader** | ✅ 100% | ✅ 100% | ✅ 100% | ✅ 100% |
| **Customization** | ✅ Full control | ⚠️ Limited | ⚠️ Limited | ✅ Full control |

---

## NEW Implementation Plan: Custom Native Solution

### Overview

**Goal:** Build custom `<OptimizedImage>` component while keeping all existing transformation infrastructure.

**Total Time:** 1-1.5 days (14 hours)
**Files to Create:** 1 component file
**Files to Update:** 11 component files + cleanup

---

### Phase 1: Build OptimizedImage Component (6 hours)

#### Step 1.1: Create Component Structure (30 min)

**Create directory:**
```bash
mkdir -p app/components/OptimizedImage
```

**Files to create:**
- `/app/components/OptimizedImage/OptimizedImage.tsx` - Main component (~200 lines)
- `/app/components/OptimizedImage/index.ts` - Exports
- `/app/components/OptimizedImage/types.ts` - TypeScript interfaces (optional)

---

#### Step 1.2: Implement Core Component (3 hours)

**File:** `/app/components/OptimizedImage/OptimizedImage.tsx`

**Features to implement:**
1. **Props Interface** - Match remix-image API
   ```tsx
   interface OptimizedImageProps {
     src: string;
     alt?: string;
     blurDataURL?: string;
     placeholder?: 'blur' | 'empty';
     placeholderAspectRatio?: number;
     responsive?: ResponsiveSize[];
     options?: {
       contentType?: string;
       fit?: 'contain' | 'cover' | 'fill';
     };
     className?: string;
     onLoadingComplete?: () => void;
   }
   ```

2. **IntersectionObserver Setup**
   - Use `react-intersection-observer` hook
   - Trigger loading when image enters viewport
   - `triggerOnce: true` for performance

3. **Srcset Generation**
   ```tsx
   const srcset = responsive
     .map(({ size }) => {
       const url = getLoaderUrl(size.width, size.height);
       return `${url} ${size.width}w`;
     })
     .join(', ');
   ```

4. **Sizes Attribute**
   ```tsx
   const sizes = responsive
     .map(({ size, maxWidth }) =>
       maxWidth
         ? `(max-width: ${maxWidth}px) ${size.width}px`
         : `${size.width}px`
     )
     .join(', ');
   ```

5. **Loading States**
   - `loading`: Initial state
   - `loaded`: Image loaded successfully
   - `error`: Image failed to load

---

#### Step 1.3: Implement Blur Placeholder (1.5 hours)

**Features:**
1. **Conditional Rendering**
   - Show placeholder when `placeholder === 'blur'` and `!loaded`
   - Hide when image loads

2. **CSS Blur Effect**
   ```tsx
   <img
     src={blurDataURL}
     style={{
       filter: 'blur(10px)',
       transform: 'scale(1.1)', // Prevent blur edges
     }}
   />
   ```

3. **Smooth Transition**
   ```tsx
   <img
     className={`transition-opacity duration-300 ${
       loaded ? 'opacity-100' : 'opacity-0'
     }`}
   />
   ```

---

#### Step 1.4: Add Error Handling (1 hour)

**Features:**
1. **Error State Management**
   ```tsx
   const [error, setError] = useState(false);
   ```

2. **Error Fallback UI**
   ```tsx
   {error && (
     <div className="flex items-center justify-center bg-gray-100">
       <span className="text-sm text-gray-500">Image unavailable</span>
     </div>
   )}
   ```

3. **onError Handler**
   ```tsx
   <img onError={() => setError(true)} />
   ```

---

### Phase 2: Replace Component Imports (4 hours)

#### Files to Update (11 files)

**Component Files (7 files):**
1. `/app/components/ProductCard/RegularCardWithActionButton.tsx`
2. `/app/components/Algolia/components/HitThumbnail.tsx`
3. `/app/components/Carousel/CarouselMinimal.tsx`
4. `/app/routes/tracking/.../ReviewForm.tsx`
5. `/app/routes/__index/events/win-a-free-surprise-gift.tsx`
6. Plus other files found during search

**Root File:**
7. `/app/root.tsx` - Remove CSS import

---

#### Step 2.1: Update Imports (~30-40 min per file)

**Before:**
```tsx
import Image, { MimeType } from 'remix-image';
import remixImageStyles from "remix-image/remix-image.css?url";

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: remixImageStyles },
];
```

**After:**
```tsx
import { OptimizedImage as Image } from '~/components/OptimizedImage';

// Remove links function or remove remix-image CSS from it
```

---

#### Step 2.2: Update Component Usage

**Changes needed:**
1. **Remove `loaderUrl` prop** (hardcoded to `/remix-image`)
2. **Replace `MimeType.WEBP`** with `'image/webp'`
3. **Keep all other props** the same

**Before:**
```tsx
<Image
  loaderUrl='/remix-image'
  options={{ contentType: MimeType.WEBP, fit: 'contain' }}
  // ... other props
/>
```

**After:**
```tsx
<Image
  options={{ contentType: 'image/webp', fit: 'contain' }}
  // ... other props (no loaderUrl)
/>
```

---

### Phase 3: Testing (3 hours)

#### Step 3.1: Unit Testing (1 hour)

**Test Cases:**
- [ ] Component renders without errors
- [ ] Props are correctly typed
- [ ] srcset is generated correctly from responsive prop
- [ ] sizes attribute matches expected format
- [ ] Blur placeholder shows and hides appropriately
- [ ] Error state displays when image fails

---

#### Step 3.2: Integration Testing (1 hour)

**Test Scenarios:**
- [ ] Images load from `/remix-image` route
- [ ] IntersectionObserver triggers loading
- [ ] Blur effect transitions smoothly
- [ ] Error fallback works
- [ ] SSR renders without errors (critical!)
- [ ] CDN caching still functions

**SSR Test:**
```bash
npm run build
npm run start
# Check console for SSR errors
```

---

#### Step 3.3: Manual QA Testing (1 hour)

**Pages to Test:**
- [ ] Homepage - Product card images in category previews
- [ ] Product detail page - Main images and carousel thumbnails
- [ ] Search results - Algolia thumbnail images (30x30)
- [ ] Tracking page - Review form modal images
- [ ] Events page - Prize product images

**Checklist per page:**
- [ ] Images load correctly
- [ ] Blur placeholders show during load
- [ ] Lazy loading works (scroll test)
- [ ] No console errors
- [ ] Network tab shows `/remix-image` requests
- [ ] Second visit serves from CDN (faster)

---

### Phase 4: Cleanup and Finalization (1 hour)

#### Step 4.1: Remove remix-image Dependencies (15 min)

**Remove packages:**
```bash
npm uninstall remix-image remix-image-sharp
```

**Packages to remove:**
- `remix-image@^1.4.0`
- `remix-image-sharp@^0.1.4`

**Packages to keep:**
- `sharp@^0.31.3` (used by loader)
- `react-intersection-observer` (used by new component)
- All other dependencies

---

#### Step 4.2: Revert Config Changes (15 min)

**File:** `/vite.config.ts`

**Revert to original:**
```typescript
ssr: {
  noExternal: [
    // ... other packages
    // 'remix-image',  // Comment it out again or remove line
  ],
}
```

Also revert the loader route if you changed it:
**File:** `/app/routes/__index/remix-image/index.tsx`
```typescript
// Revert back if needed (but changes were already in place)
import type { LoaderFunctionArgs } from "react-router"; // This can stay
```

---

#### Step 4.3: Documentation (30 min)

**Update documentation:**
1. Add component usage guide
2. Document props and types
3. Add examples for common use cases
4. Note differences from remix-image (if any)

**Create:** `/app/components/OptimizedImage/README.md`
```markdown
# OptimizedImage Component

Drop-in replacement for remix-image's Image component.

## Usage

\`\`\`tsx
import { OptimizedImage } from '~/components/OptimizedImage';

<OptimizedImage
  src={productImage}
  alt="Product"
  blurDataURL="/images/placeholder.svg"
  placeholder="blur"
  responsive={[
    { size: { width: 274, height: 274 } }
  ]}
  options={{
    contentType: 'image/webp',
    fit: 'contain'
  }}
  onLoadingComplete={() => console.log('Loaded!')}
/>
\`\`\`

## Props

- `src`: Image source URL
- `alt`: Alt text for accessibility
- `blurDataURL`: Placeholder image URL
- `placeholder`: 'blur' | 'empty'
- `responsive`: Array of size configurations
- `options`: Image transformation options
- `onLoadingComplete`: Callback when image loads

## Features

- ✅ Lazy loading with IntersectionObserver
- ✅ Blur placeholder support
- ✅ Responsive images (srcset/sizes)
- ✅ Error handling
- ✅ SSR compatible
\`\`\`

---

### Phase 5: Deployment (Optional - 2 hours)

#### Step 5.1: Staging Deployment

**Steps:**
1. Deploy to staging environment
2. Run full regression tests
3. Verify R2 uploads still work
4. Monitor for 24 hours

**Validation:**
- [ ] All images load correctly
- [ ] No console errors
- [ ] R2 bucket receives uploads
- [ ] CDN serving cached images
- [ ] Performance metrics acceptable

---

#### Step 5.2: Production Deployment

**Prerequisites:**
- ✅ Staging validation complete
- ✅ All tests passing
- ✅ Team review complete
- ✅ Rollback plan ready

**Steps:**
1. Deploy during low-traffic window
2. Monitor error rates
3. Check image loading metrics
4. Verify CDN hit rates

---

## ~~OLD Implementation Plan~~ (OBSOLETE - FAILED)

### ~~Phase 1: Update Imports~~ ✅ COMPLETED BUT FAILED

#### ~~Step 1.1: Update Loader Route~~
**File:** `/app/routes/__index/remix-image/index.tsx`

**Change:**
```typescript
// Changed from "@remix-run/server-runtime" to "react-router"
```

**Status:** ✅ COMPLETED

---

#### ~~Step 1.2: Update Component Imports~~

**Status:** ✅ COMPLETED (No changes needed - already using react-router)

---

### ~~Phase 2: Fix SSR Configuration~~ ✅ COMPLETED BUT FAILED

#### ~~Step 2.1: Update vite.config.ts~~
**File:** `/vite.config.ts` (Line 47)

**Change:**
```typescript
// Uncommented 'remix-image' in ssr.noExternal
```

**Status:** ✅ COMPLETED

**Result:** ❌ **FAILED - Same error persists**

---

### ~~Phase 3: Testing~~ ❌ CANCELLED (Fix failed)

#### Step 3.1: Build Test
```bash
npm run build
```

**Expected Outcome:**
- ✅ Build completes without errors
- ✅ No type errors
- ✅ remix-image bundled successfully

**If Errors Occur:**
- Check import paths in build output
- Verify type compatibility
- Check for missing dependencies
- Review console for specific errors

---

#### Step 3.2: Dev Server Test
```bash
npm run dev
```

**Test Checklist:**
- [ ] Product cards load images (RegularCardWithActionButton.tsx)
- [ ] Carousel thumbnails display (CarouselMinimal.tsx)
- [ ] Search result thumbnails appear (HitThumbnail.tsx)
- [ ] Review form images load (ReviewForm.tsx)
- [ ] Event page images display (win-a-free-surprise-gift.tsx)
- [ ] Blur placeholders show during loading
- [ ] No console errors
- [ ] Network tab shows `/remix-image?src=...&width=...&height=...` requests
- [ ] Images successfully transform to WebP

**Pages to Test:**
1. Homepage: Product cards in category previews
2. Product detail page: Main images and carousel
3. Search results: Algolia thumbnail images
4. Tracking page: Review form modal
5. Events page: Prize product images

---

#### Step 3.3: Transformation Test
```bash
# Test the loader directly
curl "http://localhost:5173/remix-image?src=https://storage.googleapis.com/peasydeal/product-images/test.png&width=400&height=400&contentType=image/webp"
```

**Expected:**
- Returns WebP image
- Proper headers: `Content-Type: image/webp`
- Cache headers: `Cache-Control: public, max-age=31536000`

---

#### Step 3.4: CDN Caching Test

**Test Flow:**
1. Visit product page (first request)
   - Should transform image on-the-fly
   - Network tab shows `/remix-image` request
   - Response time: ~200-500ms
2. Refresh page (second request)
   - Should serve from CDN
   - Network tab shows direct CDN URL
   - Response time: ~20-50ms

---

#### Step 3.5: R2 Upload Test (Staging Environment)

**Deploy to Staging:**
```bash
npm run build
# Deploy to staging environment
```

**Verify R2 Bucket:**
- Check new uploads at path: `webp/w{width}_h{height}/{filename}.webp`
- Verify images accessible via CDN URL
- Test multiple sizes (274x274, 100x100, 75x75, 30x30)

**Environment Variables Required:**
```
CDN_URL
DOMAIN
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
NODE_ENV=production
```

---

### Phase 4: Monitoring

#### Key Metrics to Monitor

**Performance:**
- Image transformation time (should be < 500ms)
- CDN hit rate (should be > 95% after warmup)
- Memory usage (watch for Sharp memory leaks)
- Build time (should not significantly increase)

**Errors:**
- Console errors during image load
- 404s for image requests
- R2 upload failures
- Transform failures

**Quality:**
- Image quality (no visible artifacts)
- Correct dimensions
- WebP format conversion working
- Blur placeholder transitions

---

## Rollback Plan

### Option 1: Immediate Git Rollback

**If build or runtime fails:**
```bash
# Rollback all changes
git checkout HEAD -- app/routes/__index/remix-image/index.tsx
git checkout HEAD -- vite.config.ts
npm install
npm run build
```

---

### Option 2: Quick Custom Component (30 min)

**If remix-image completely breaks:**

Create `/app/components/CDNImage.tsx`:
```tsx
import { useState } from 'react';
import { envs } from '~/utils/env';

interface CDNImageProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

export function CDNImage({
  src,
  width = 400,
  height = 400,
  alt = '',
  className = ''
}: CDNImageProps) {
  const [loaded, setLoaded] = useState(false);

  const filename = src.substring(src.lastIndexOf('/') + 1);
  const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  const cdnUrl = `${envs.CDN_URL}/webp/w${width}_h${height}/${filenameWithoutExt}.webp`;

  return (
    <img
      src={loaded ? cdnUrl : `${envs.DOMAIN}/images/placeholder.svg`}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      onLoad={() => setLoaded(true)}
    />
  );
}
```

**Replace imports in all files:**
```bash
find app -type f -name "*.tsx" -exec sed -i '' \
  's/import Image.*from "remix-image"/import { CDNImage as Image } from "~\/components\/CDNImage"/g' {} +
```

**Keep the loader route:**
- `/app/routes/__index/remix-image/` directory stays intact
- Continue to provide on-the-fly transformations
- CDN caching continues to work
- Only the React component changes

---

## Potential Issues & Mitigations

### Issue 1: Package Compatibility
**Problem:** remix-image unmaintained since 2022
**Mitigation:**
- Test thoroughly before deploying
- Have rollback ready
- Monitor GitHub issues: https://github.com/Josh-McFarlin/remix-image

### Issue 2: Type Mismatches
**Problem:** `LoaderFunctionArgs` type differences
**Mitigation:**
```typescript
import type { LoaderFunctionArgs as RRLoaderArgs } from 'react-router';
export const loader = async ({ request }: RRLoaderArgs) => {
  // Type adapter if needed
};
```

### Issue 3: SSR Bundling Issues
**Problem:** Vite may still have issues bundling remix-image
**Mitigation:**
- Try different Vite SSR strategies
- May need to externalize Sharp dependencies
- Consider using `ssr.external` for specific sub-packages

### Issue 4: Sharp Native Dependencies
**Problem:** Sharp uses native binaries, platform compatibility
**Mitigation:**
- Ensure `sharp@0.31.3` compatible with Node version
- May need rebuild: `npm rebuild sharp`
- Check deployment platform supports Sharp
- Verify native bindings for target architecture

### Issue 5: R2 Upload Failures
**Problem:** R2 credentials or network issues in production
**Mitigation:**
- Already has try-catch in transformer.ts (lines 168-175)
- Gracefully returns transformed image even if upload fails
- Monitor R2 errors in logs
- Set up alerting for repeated failures

---

## Success Criteria

### Build Phase
- [x] Files updated successfully
- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors
- [ ] No module resolution errors
- [ ] Build output includes remix-image bundle

### Dev Phase
- [ ] Dev server starts successfully
- [ ] All pages load without errors
- [ ] Images display correctly
- [ ] Blur placeholders work
- [ ] Loading states transition properly
- [ ] No console errors or warnings

### Runtime Phase
- [ ] Image transformations work (first request)
- [ ] CDN caching works (subsequent requests)
- [ ] R2 uploads succeed in production
- [ ] All image sizes render correctly (274, 100, 75, 30)
- [ ] WebP format conversion working
- [ ] Performance metrics acceptable

### Quality Phase
- [ ] Image quality unchanged
- [ ] No visual artifacts
- [ ] Aspect ratios preserved
- [ ] SEO image URLs unchanged
- [ ] Lighthouse scores maintained

---

## Changes Summary

### Files Modified: 2

1. **`/app/routes/__index/remix-image/index.tsx`**
   - Line 1: Changed `LoaderFunctionArgs` import from `@remix-run/server-runtime` to `react-router`

2. **`/vite.config.ts`**
   - Line 47: Uncommented `'remix-image'` in `ssr.noExternal` array

### Files Analyzed (No Changes Needed): 5
- Component imports already use `react-router`
- No remix-image import changes required

### Total Lines Changed: 2 lines

---

## Timeline

### NEW Timeline: Custom Native Solution

| Phase | Duration | Status |
|-------|----------|--------|
| Analysis & Planning | 3 hours | ✅ COMPLETED |
| ~~Attempted Fix (Failed)~~ | ~~1 hour~~ | ❌ FAILED |
| **Build OptimizedImage Component** | **6 hours** | ⏳ PENDING |
| **Replace Component Imports** | **4 hours** | ⏳ PENDING |
| **Testing (Unit + Integration + Manual)** | **3 hours** | ⏳ PENDING |
| **Cleanup & Documentation** | **1 hour** | ⏳ PENDING |
| **Staging Deploy** | **2 hours** | ⏳ PENDING |
| **Production Deploy** | **1 hour** | ⏳ PENDING |
| **Total** | **~20 hours (1-1.5 days)** | **15% COMPLETE** |

### ~~OLD Timeline~~ (OBSOLETE - Fix Failed)

| Phase | Duration | Status |
|-------|----------|--------|
| ~~Analysis & Planning~~ | ~~2 hours~~ | ✅ COMPLETED |
| ~~Import Updates~~ | ~~15 min~~ | ✅ COMPLETED |
| ~~SSR Config Update~~ | ~~5 min~~ | ✅ COMPLETED |
| ~~Build Testing~~ | ~~15 min~~ | ❌ FAILED |
| **Result** | **Fix did not work** | ❌ **MIGRATION REQUIRED** |

---

## Dependencies

### Current Versions
```json
{
  "remix-image": "^1.4.0",
  "remix-image-sharp": "^0.1.4",
  "sharp": "^0.31.3",
  "@aws-sdk/client-s3": "^3.722.0",
  "react-router": "^7.9.5",
  "vite": "^7.2.1"
}
```

### No Package Changes Required
- All dependencies remain unchanged
- No npm install needed
- Keep existing lock file

---

## Long-Term Considerations

### Future Migration Options

If remix-image becomes problematic in the future, consider:

1. **unpic (Recommended for future)**
   - Modern, actively maintained
   - Built for React Router + Vite
   - Migration effort: 3-5 days

2. **imgproxy (Enterprise option)**
   - Dedicated service
   - Better scaling for high traffic
   - Requires infrastructure setup

3. **Custom solution**
   - Full control
   - Reuse existing transformer logic
   - ~3-4 days development

### Maintenance Notes

- Monitor remix-image GitHub for updates
- Watch for React Router breaking changes
- Consider future migration when traffic scales
- Keep Sharp updated for security patches

---

## Reference Links

- [remix-image GitHub](https://github.com/Josh-McFarlin/remix-image)
- [React Router v7 Docs](https://reactrouter.com)
- [Vite SSR Configuration](https://vitejs.dev/guide/ssr.html)
- [Sharp Image Processing](https://sharp.pixelplumbing.com)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)

---

## Contact & Support

**If Issues Occur:**
1. Check this document for troubleshooting steps
2. Review error logs in console and server
3. Test rollback procedures
4. Consider fallback custom component option

**Next Steps:**
- ~~Proceed with build testing~~ ❌ Failed
- **NEW: Build Custom OptimizedImage Component**
- Replace imports in 11 component files
- Test thoroughly (SSR, images, blur placeholders)
- Deploy to staging
- Monitor production deployment

---

## Summary

**Original Plan:** Keep remix-image with minimal configuration changes ❌ **FAILED**

**NEW Plan:** Build custom OptimizedImage component ✅ **RECOMMENDED**

**Key Points:**
1. remix-image has fundamental ESM/CommonJS incompatibility that cannot be fixed
2. Custom solution preserves 100% of existing infrastructure (415 lines of Sharp/R2/CDN code)
3. Migration takes 1-1.5 days (14-20 hours)
4. Drop-in replacement with same API
5. Zero new dependencies
6. Full control over features and enhancements

**Recommended Action:** Proceed with Custom Native Solution (Option 1)

---

**Document Version:** 2.0
**Last Updated:** 2025-11-11 12:30 PM
**Status:** Ready for Implementation
**Author:** Claude Code (AI Assistant)
