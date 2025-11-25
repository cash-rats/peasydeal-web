# Image Migration Strategy
# remix-image in React Router 7

## Current Setup Analysis

Your project uses `remix-image` in a custom way:

### 1. Custom Image Loader Route
**File**: `app/routes/__index/remix-image/index.tsx`

- Serves optimized images via `/remix-image` route
- Fetches from CDN first (`envs.CDN_URL`)
- Falls back to `remix-image` server-side transformation
- Uses Cloudflare R2 for storage

### 2. Image Component Usage
Used in multiple components:
- `ProductCard/RegularCardWithActionButton.tsx`
- `Carousel/CarouselMinimal.tsx`
- `Algolia/components/HitThumbnail.tsx`
- Various other components

Example usage:
```tsx
import Image, { MimeType } from "remix-image"

<Image
  src={productImage}
  loaderUrl='/remix-image'
  responsive={[
    { size: { width: 400, height: 400 } }
  ]}
/>
```

---

## Migration Strategy

### ✅ Option 1: Keep remix-image (Recommended for Your Case)

**Why**:
- You have a working image optimization system
- Custom CDN integration already in place
- Minimal changes needed
- Lower risk

**What to do**:

1. **Keep the remix-image package**
   ```bash
   # DON'T uninstall remix-image
   # Keep it in package.json
   ```

2. **Migrate the `/remix-image` route to React Router 7**

   Update `app/routes/__index/remix-image/index.tsx`:
   ```typescript
   // app/routes/__index/remix-image/index.tsx
   import type { LoaderFunction } from "react-router"; // ← Changed
   import { imageLoader, MemoryCache } from 'remix-image/server';
   import type { LoaderConfig } from 'remix-image';
   import httpStatus from 'http-status-codes';

   import { envs } from '~/utils/get_env_source';
   import transformer from './transformer';
   import { imageResponse, badImageResponse } from './response';
   import { fileExtensionResolver, MimeType } from './mimes';

   const config: LoaderConfig = {
     selfUrl: `${envs.CDN_URL}/product-images`,
     cache: new MemoryCache(),
     transformer,
   };

   const composeCDNUrl = (params: { width: number, height: number, filename: string }) => {
     const url = new URL(envs.CDN_URL);
     url.pathname = `webp/w${params.width}_h${params.height}/${params.filename}`;
     return url.toString();
   };

   const maxAge = 60 * 60 * 24 * 365;

   export const loader: LoaderFunction = async ({ request }) => {
     const url = new URL(request.url);
     const width = url.searchParams.get('width') as string || '';
     const height = url.searchParams.get('height') as string || '';
     const src = url.searchParams.get('src') as string || '';
     const contentType = url.searchParams.get('contentType') as MimeType || MimeType.WEBP;
     const fileExt = fileExtensionResolver.get(contentType);

     if (src === '') return badImageResponse();

     if (width && height && src && fileExt) {
       const filename = src.substring(src.lastIndexOf('/') + 1, src.length);
       const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));

       const dnsURL = composeCDNUrl({
         width: parseInt(width),
         height: parseInt(height),
         filename: `${filenameWithoutExt}${fileExt}`,
       });

       const imageFromCDN = await fetch(dnsURL);

       // Image exists in CDN, return it
       if (imageFromCDN.ok && imageFromCDN.body) {
         return imageResponse(
           new Uint8Array(await imageFromCDN.arrayBuffer()),
           httpStatus.OK,
           MimeType.WEBP,
           `public, max-age=${maxAge}`
         );
       }
     }

     return imageLoader(config, request);
   };
   ```

3. **Update component imports**

   Components using remix-image need minimal changes:
   ```typescript
   // ProductCard/RegularCardWithActionButton.tsx
   import { Link } from 'react-router'; // ← Changed from @remix-run/react
   import type { LinksFunction } from 'react-router'; // ← Changed
   import Image, { MimeType } from "remix-image"; // ← Keep this!

   // Usage stays exactly the same
   <Image
     src={productImage}
     loaderUrl='/remix-image'
     responsive={[
       { size: { width: 400, height: 400 } }
     ]}
   />
   ```

4. **Update root.tsx**
   ```typescript
   // app/root.tsx
   import remixImageStyles from "remix-image/remix-image.css?url"; // ← Add ?url

   export function links() {
     return [
       { rel: "stylesheet", href: remixImageStyles },
       // ... other links
     ];
   }
   ```

**Changes needed**:
- ✅ Update import statements from `@remix-run/*` to `react-router`
- ✅ Add `?url` to CSS import in root.tsx
- ✅ Keep all remix-image component usage unchanged

**Benefits**:
- ✅ Minimal code changes
- ✅ Proven image optimization
- ✅ CDN integration preserved
- ✅ Low risk

**Testing**:
```bash
# After migration, test images:
npm run dev

# Check:
# - Product images load
# - Image optimization works
# - CDN fallback works
# - /remix-image route responds
```

---

### ⚠️ Option 2: Replace with Native Solution (Higher Risk)

Only consider this if remix-image causes issues in React Router 7.

**Replace remix-image with**:

#### A. Standard img tags + CDN URLs
```tsx
// Instead of:
<Image
  src={productImage}
  loaderUrl='/remix-image'
  responsive={[{ size: { width: 400, height: 400 } }]}
/>

// Use:
<img
  src={`${CDN_URL}/webp/w400_h400/${imageFilename}`}
  alt={title}
  loading="lazy"
/>
```

**Pros**: Simple, no dependencies
**Cons**: Lose responsive image features, manual URL construction

#### B. Next.js Image Component (Vercel)
```bash
npm install next/image
```

```tsx
import Image from 'next/image';

<Image
  src={productImage}
  width={400}
  height={400}
  loader={({ src, width }) =>
    `${CDN_URL}/webp/w${width}_h${width}/${src}`
  }
/>
```

**Pros**: Vercel-optimized, modern
**Cons**: Major refactor, different API

#### C. Custom React Component
```tsx
// app/components/OptimizedImage.tsx
export function OptimizedImage({
  src,
  width,
  height,
  alt
}: ImageProps) {
  const filename = src.substring(src.lastIndexOf('/') + 1);
  const cdnUrl = `${CDN_URL}/webp/w${width}_h${height}/${filename}`;

  return <img src={cdnUrl} alt={alt} loading="lazy" />;
}
```

**Pros**: Custom control
**Cons**: Need to rebuild responsive features

---

## Recommended Approach for Your Project

### ✅ Keep remix-image (Update imports only)

**Reasons**:
1. You have 9 files using it extensively
2. Custom CDN integration working well
3. Lower migration risk
4. Less code changes
5. Proven to work with your Cloudflare R2 setup

**Migration Steps**:

1. **Update imports** (Day 4 of migration):
   ```bash
   # Update in all files using remix-image
   find app -type f -name "*.tsx" -exec sed -i '' \
     's/@remix-run\/react/react-router/g' {} +

   find app -type f -name "*.tsx" -exec sed -i '' \
     's/@remix-run\/node/react-router/g' {} +
   ```

2. **Update image route loader type**:
   ```typescript
   // app/routes/__index/remix-image/index.tsx
   import type { LoaderFunction } from "react-router";
   ```

3. **Update CSS import in root.tsx**:
   ```typescript
   import remixImageStyles from "remix-image/remix-image.css?url";
   ```

4. **Test thoroughly**:
   - [ ] Product images load
   - [ ] Different sizes work
   - [ ] CDN fetching works
   - [ ] Fallback transformation works
   - [ ] No console errors

5. **No component changes needed** - The `<Image>` components stay as-is!

---

## Files That Need Updates

### Import Updates Only:
```
✅ app/components/ProductCard/RegularCardWithActionButton.tsx
✅ app/components/Carousel/CarouselMinimal.tsx
✅ app/components/Algolia/components/HitThumbnail.tsx
✅ app/routes/__index/events/win-a-free-surprise-gift.tsx
✅ app/routes/tracking/components/.../ReviewForm.tsx
```

Change:
```typescript
// OLD
import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

// NEW
import { Link } from 'react-router';
import type { LinksFunction } from 'react-router';

// Keep this unchanged:
import Image, { MimeType } from "remix-image";
```

### Loader Type Update:
```
✅ app/routes/__index/remix-image/index.tsx
```

Change:
```typescript
// OLD
import type { LoaderFunction } from "@remix-run/server-runtime";

// NEW
import type { LoaderFunction } from "react-router";
```

### CSS Import Update:
```
✅ app/root.tsx
```

Change:
```typescript
// OLD
import remixImageStyles from "remix-image/remix-image.css";

// NEW
import remixImageStyles from "remix-image/remix-image.css?url";
```

---

## Testing Checklist

After migration:

- [ ] Build succeeds: `npm run build`
- [ ] Dev server runs: `npm run dev`
- [ ] Visit product pages - images load
- [ ] Check network tab - `/remix-image?src=...&width=...` requests work
- [ ] Check CDN requests - webp images served
- [ ] Test different viewport sizes - responsive images work
- [ ] Check browser console - no errors
- [ ] Test on production deployment

---

## If remix-image Breaks in React Router 7

**Fallback plan** (only if above doesn't work):

1. Create custom image component using your CDN directly:
   ```tsx
   // app/components/CDNImage.tsx
   export function CDNImage({ src, width, height, alt }: Props) {
     const filename = src.substring(src.lastIndexOf('/') + 1);
     const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
     const cdnUrl = `${CDN_URL}/webp/w${width}_h${height}/${filenameWithoutExt}.webp`;

     return (
       <img
         src={cdnUrl}
         alt={alt}
         width={width}
         height={height}
         loading="lazy"
       />
     );
   }
   ```

2. Replace all `<Image>` with `<CDNImage>`:
   ```bash
   # Find and replace in components
   find app/components -name "*.tsx" -exec sed -i '' \
     's/import Image.*from "remix-image"/import { CDNImage as Image } from "~\/components\/CDNImage"/g' {} +
   ```

---

## Summary

### For Your Migration:

✅ **KEEP remix-image package** - Don't uninstall
✅ **UPDATE imports only** - Change `@remix-run/*` to `react-router`
✅ **UPDATE loader type** - In `/remix-image/index.tsx`
✅ **UPDATE CSS import** - Add `?url` suffix
✅ **KEEP all Image components** - No changes to usage

This is the **lowest risk approach** for your project.

---

## Updated Migration Plan Section

**Day 1 - Dependencies**:

```bash
# Remove Remix core (but KEEP remix-image!)
npm uninstall \
  @remix-run/node \
  @remix-run/react \
  @remix-run/serve \
  @remix-run/dev

# DON'T uninstall these:
# remix-image ← KEEP THIS
# remix-image-sharp ← KEEP THIS (if used)
```

**Day 4 - Import Updates**:

Include this in your update script:
```bash
# Update imports but skip remix-image package imports
find app -type f -name "*.tsx" -exec sed -i '' \
  's/from "@remix-run\/react"/from "react-router"/g' {} +

find app -type f -name "*.tsx" -exec sed -i '' \
  's/from "@remix-run\/node"/from "react-router"/g' {} +

# This will keep: import Image from "remix-image"
# Only changes the Remix framework imports
```

**Day 5 - Testing**:

Add to testing checklist:
- [ ] Images load on product pages
- [ ] `/remix-image` route works
- [ ] CDN integration works
- [ ] No image-related errors
