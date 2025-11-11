# OptimizedImage Component

Drop-in replacement for remix-image's Image component. Built with React, IntersectionObserver, and integrated with the existing `/remix-image` loader route.

## Architecture: Hybrid Approach

This project uses a **hybrid approach** to solve the remix-image SSR compatibility issues:

- **Client-side**: Custom `OptimizedImage` component (this component) - handles all React rendering
- **Server-side**: `remix-image` package - powers the `/remix-image` loader route for image transformation

**Why this works:**
- The SSR error (`"exports is not defined"`) was caused by remix-image's client-side Image component
- The server-side functionality (`imageLoader`, `MemoryCache`) works perfectly fine
- By separating concerns, we get the best of both worlds:
  - ✅ No SSR/ESM errors (custom client component)
  - ✅ Proven image transformation pipeline (remix-image server code)
  - ✅ All 415 lines of Sharp/R2/CDN infrastructure preserved

## Features

- ✅ Lazy loading with IntersectionObserver
- ✅ Blur placeholder support with smooth transitions
- ✅ Responsive images (automatic srcset/sizes generation)
- ✅ Error handling with fallback UI
- ✅ SSR compatible
- ✅ onLoadingComplete callback
- ✅ TypeScript support

## Installation

### Dependencies

**Client-side:**
- `react-intersection-observer` - For lazy loading (already installed)

**Server-side:**
- `remix-image` - For image loader and caching (installed, server-only)
- `remix-image-sharp` - For Sharp transformer integration (installed, server-only)

**Note:** The `remix-image` packages are **NOT** included in Vite's `ssr.noExternal` configuration, keeping them as external server-only dependencies. This avoids the SSR "exports is not defined" error while still using their proven transformation logic.

## Basic Usage

```tsx
import { OptimizedImage } from '~/components/OptimizedImage';

<OptimizedImage
  src="https://example.com/image.jpg"
  alt="Product image"
  responsive={[
    { size: { width: 274, height: 274 } }
  ]}
  options={{
    contentType: 'image/webp',
    fit: 'contain'
  }}
/>
```

## Advanced Usage with Blur Placeholder

```tsx
import { OptimizedImage } from '~/components/OptimizedImage';
import { envs } from '~/utils/env';

const [loaded, setLoaded] = useState(false);

<OptimizedImage
  src={productImage}
  alt="Product"
  blurDataURL={`${envs.DOMAIN}/images/${loaded
    ? 'placeholder_transparent.png'
    : 'placeholder.svg'
  }`}
  placeholder={loaded ? 'empty' : 'blur'}
  placeholderAspectRatio={1}
  onLoadingComplete={() => setLoaded(true)}
  responsive={[
    { size: { width: 274, height: 274 } }
  ]}
  options={{
    contentType: 'image/webp',
    fit: 'contain'
  }}
  className="rounded-lg"
/>
```

## Props

### OptimizedImageProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | *required* | Image source URL |
| `alt` | `string` | `''` | Alt text for accessibility |
| `blurDataURL` | `string` | `undefined` | Placeholder image URL for blur effect |
| `placeholder` | `'blur' \| 'empty'` | `'empty'` | Placeholder type |
| `placeholderAspectRatio` | `number` | `1` | Aspect ratio for placeholder (e.g., 1 for square) |
| `responsive` | `ResponsiveSize[]` | `[{ size: { width: 400, height: 400 } }]` | Array of responsive image sizes |
| `options` | `ImageOptions` | `{ contentType: 'image/webp', fit: 'contain' }` | Image transformation options |
| `className` | `string` | `''` | CSS class name |
| `style` | `React.CSSProperties` | `{}` | Inline styles |
| `onLoadingComplete` | `() => void` | `undefined` | Callback when image finishes loading |

### ResponsiveSize

```typescript
interface ResponsiveSize {
  size: {
    width: number;
    height: number;
  };
  maxWidth?: number; // Optional: for media query breakpoint
}
```

### ImageOptions

```typescript
interface ImageOptions {
  contentType?: string;  // e.g., 'image/webp', 'image/jpeg'
  fit?: 'contain' | 'cover' | 'fill';
}
```

## Responsive Images

The component automatically generates `srcset` and `sizes` attributes based on the `responsive` prop:

```tsx
<OptimizedImage
  src={image}
  responsive={[
    { size: { width: 100, height: 100 }, maxWidth: 640 },
    { size: { width: 274, height: 274 }, maxWidth: 1024 },
    { size: { width: 400, height: 400 } }
  ]}
/>

// Generates:
// srcset="/remix-image?src=...&width=100&height=100 100w,
//         /remix-image?src=...&width=274&height=274 274w,
//         /remix-image?src=...&width=400&height=400 400w"
// sizes="(max-width: 640px) 100px,
//        (max-width: 1024px) 274px,
//        400px"
```

## Integration with /remix-image Loader

The component integrates seamlessly with the existing `/remix-image` loader route:

- **Tier 1 (CDN)**: Checks Cloudflare CDN for pre-transformed images
- **Tier 2 (On-the-fly)**: Uses Sharp to transform images and uploads to R2
- **Caching**: Future requests are served from CDN

No changes are needed to the loader infrastructure (`/app/routes/__index/remix-image/`).

## Lazy Loading

Images are lazy-loaded using IntersectionObserver with a 500px root margin. This means images start loading when they're 500px away from entering the viewport:

```tsx
// Lazy loading is automatic
<OptimizedImage src={image} />
```

## Blur Placeholder

The blur placeholder creates a smooth loading experience:

1. Shows blurred placeholder while loading
2. Loads actual image in background
3. Fades to actual image when loaded

```tsx
<OptimizedImage
  src={image}
  blurDataURL="/images/placeholder.svg"
  placeholder="blur"  // Show blur effect
/>
```

## Error Handling

If an image fails to load, a fallback UI is displayed:

```tsx
// Automatic error handling
<OptimizedImage src={possiblyBrokenImage} />

// Shows: "Image unavailable" message on gray background
```

## Migration from remix-image

Migrating from `remix-image` is straightforward:

### Before (remix-image)

```tsx
import Image, { MimeType } from 'remix-image';

<Image
  loaderUrl='/remix-image'
  options={{ contentType: MimeType.WEBP }}
  // ... other props
/>
```

### After (OptimizedImage)

```tsx
import { OptimizedImage as Image } from '~/components/OptimizedImage';

<Image
  options={{ contentType: 'image/webp' }}
  // ... other props (no loaderUrl needed)
/>
```

### Key Differences

1. **No `loaderUrl` prop** - Hardcoded to `/remix-image`
2. **String content type** - Use `'image/webp'` instead of `MimeType.WEBP`
3. **No `naturalDimensions` parameter** - `onLoadingComplete` callback has no parameters

## Examples

### Product Card Image

```tsx
<OptimizedImage
  src={product.main_pic}
  alt={product.title}
  blurDataURL={`${envs.DOMAIN}/images/placeholder.svg`}
  placeholder="blur"
  placeholderAspectRatio={1}
  onLoadingComplete={() => setLoaded(true)}
  responsive={[{ size: { width: 274, height: 274 } }]}
  options={{ contentType: 'image/webp', fit: 'contain' }}
  className="aspect-square rounded-lg"
/>
```

### Thumbnail Image

```tsx
<OptimizedImage
  src={thumbnail}
  alt="Thumbnail"
  blurDataURL={`${envs.DOMAIN}/images/placeholder.svg`}
  placeholder="blur"
  placeholderAspectRatio={1}
  responsive={[{ size: { width: 30, height: 30 } }]}
  options={{ contentType: 'image/webp', fit: 'contain' }}
/>
```

### Carousel Image

```tsx
<OptimizedImage
  src={item.url}
  alt={item.title}
  blurDataURL={`${envs.DOMAIN}/images/placeholder_transparent.png`}
  placeholder="empty"
  placeholderAspectRatio={1}
  responsive={[{ size: { width: 100, height: 100 } }]}
  options={{ contentType: 'image/webp', fit: 'contain' }}
  className="rounded-lg border-2"
/>
```

## Performance

- **Lazy loading**: Images only load when near viewport (500px margin)
- **CDN caching**: First request transforms, subsequent requests served from CDN
- **WebP format**: Smaller file sizes compared to JPEG/PNG
- **Responsive images**: Browser downloads appropriate size for viewport

## Browser Compatibility

- Modern browsers with IntersectionObserver support
- Fallback to immediate loading if IntersectionObserver is not available
- Native lazy loading (`loading="lazy"`) as additional optimization

## Troubleshooting

### Images not loading

1. Check that the `/remix-image` loader route is working
2. Verify image URLs are accessible
3. Check browser console for errors

### Blur placeholder not showing

1. Ensure `blurDataURL` is provided
2. Set `placeholder` prop to `'blur'`
3. Check that placeholder image exists

### TypeScript errors

1. Ensure proper imports: `import { OptimizedImage } from '~/components/OptimizedImage'`
2. Check prop types match `OptimizedImageProps` interface

## Related Files

- Component: `/app/components/OptimizedImage/OptimizedImage.tsx`
- Types: `/app/components/OptimizedImage/index.ts`
- Loader: `/app/routes/__index/remix-image/index.tsx`
- Transformer: `/app/routes/__index/remix-image/transformer.ts`

## License

Part of the Peasydeal project.
