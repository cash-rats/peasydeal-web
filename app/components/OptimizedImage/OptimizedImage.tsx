import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { envs } from '~/utils/env';
import { fileExtensionResolver, MimeType } from '~/routes/remix-image/mimes';

/**
 * Responsive image size configuration
 */
export interface ResponsiveSize {
  size: {
    width: number;
    height: number;
  };
  maxWidth?: number;
}

/**
 * Image transformation options
 */
export interface ImageOptions {
  contentType?: string;
  fit?: 'contain' | 'cover' | 'fill';
}

/**
 * OptimizedImage component props - API compatible with remix-image
 */
export interface OptimizedImageProps {
  src: string;
  alt?: string;
  blurDataURL?: string;
  placeholder?: 'blur' | 'empty';
  placeholderAspectRatio?: number;
  responsive?: ResponsiveSize[];
  options?: ImageOptions;
  className?: string;
  onLoadingComplete?: () => void;
  style?: React.CSSProperties;
}

/**
 * OptimizedImage - Drop-in replacement for remix-image's Image component
 *
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Blur placeholder support
 * - Responsive images (srcset/sizes)
 * - Error handling
 * - SSR compatible
 * - onLoadingComplete callback
 */
export function OptimizedImage({
  src,
  alt = '',
  blurDataURL,
  placeholder = 'empty',
  placeholderAspectRatio = 1,
  responsive = [{ size: { width: 400, height: 400 } }],
  options = { contentType: 'image/webp', fit: 'contain' },
  className = '',
  onLoadingComplete,
  style = {},
}: OptimizedImageProps) {
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [shouldLoad, setShouldLoad] = useState(false);
  const [useCdn, setUseCdn] = useState(false);

  // IntersectionObserver setup for lazy loading
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '500px', // Start loading 500px before entering viewport
  });

  // Trigger loading when image enters viewport
  useEffect(() => {
    if (inView && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [inView, shouldLoad]);

  // Generate loader URL for image transformation
  const getLoaderUrl = useCallback(
    (width: number, height: number) => {
      const params = new URLSearchParams({
        src,
        width: width.toString(),
        height: height.toString(),
      });

      if (options.contentType) {
        params.append('contentType', options.contentType);
      }

      if (options.fit) {
        params.append('fit', options.fit);
      }

      return `/remix-image?${params.toString()}`;
    },
    [src, options.contentType, options.fit]
  );

  const getCdnUrl = useCallback(
    (width: number, height: number) => {
      if (!src) return null;

      const contentType = (options.contentType as MimeType | undefined) ?? MimeType.WEBP;
      const fileExt = fileExtensionResolver.get(contentType);
      if (!fileExt) return null;

      const filename = src.substring(src.lastIndexOf('/') + 1, src.length);
      const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));

      try {
        const cdnUrl = new URL(envs.CDN_URL);
        cdnUrl.pathname = `.webp/w${width}_h${height}/${filenameWithoutExt}${fileExt}`;
        return cdnUrl.toString();
      } catch (error) {
        console.error('Failed to compose CDN URL:', error);
        return null;
      }
    },
    [options.contentType, src]
  );

  // Generate srcset attribute for responsive images
  const srcset = responsive
    .map(({ size }) => {
      const url = useCdn ? getCdnUrl(size.width, size.height) : getLoaderUrl(size.width, size.height);
      return `${url ?? getLoaderUrl(size.width, size.height)} ${size.width}w`;
    })
    .join(', ');

  // Generate sizes attribute
  const sizes = responsive
    .map(({ size, maxWidth }) => {
      if (maxWidth) {
        return `(max-width: ${maxWidth}px) ${size.width}px`;
      }
      return `${size.width}px`;
    })
    .join(', ');

  // Use the first responsive size as the default src
  const defaultSize = responsive[0].size;
  const imgSrc =
    (useCdn && getCdnUrl(defaultSize.width, defaultSize.height)) ||
    getLoaderUrl(defaultSize.width, defaultSize.height);

  // Probe CDN availability when the image should load
  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;
    const checkCdn = async () => {
      const urls = responsive
        .map(({ size }) => getCdnUrl(size.width, size.height))
        .filter((u): u is string => Boolean(u));

      if (urls.length !== responsive.length) {
        setUseCdn(false);
        return;
      }

      try {
        const results = await Promise.all(
          urls.map(async (url) => {
            const res = await fetch(url, { method: 'HEAD' });
            return res.ok;
          })
        );

        if (!cancelled) {
          setUseCdn(results.every(Boolean));
        }
      } catch {
        if (!cancelled) {
          setUseCdn(false);
        }
      }
    };

    checkCdn();

    return () => {
      cancelled = true;
    };
  }, [getCdnUrl, responsive, shouldLoad]);

  // Handle image load complete
  const handleLoad = useCallback(() => {
    setLoadingState('loaded');
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  // Handle image load error
  const handleError = useCallback(() => {
    setLoadingState('error');
  }, []);

  // Show blur placeholder
  const showBlurPlaceholder = placeholder === 'blur' && blurDataURL && loadingState === 'loading';

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: placeholderAspectRatio ? `${placeholderAspectRatio}` : undefined,
        ...style,
      }}
    >
      {/* Blur placeholder layer */}
      {showBlurPlaceholder && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(10px)',
            transform: 'scale(1.1)', // Prevent blur edges from showing
          }}
        />
      )}

      {/* Error fallback */}
      {loadingState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-500">Image unavailable</span>
        </div>
      )}

      {/* Main image - only load when in viewport */}
      {shouldLoad && loadingState !== 'error' && (
        <img
          src={imgSrc}
          srcSet={srcset}
          sizes={sizes}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loadingState === 'loaded' ? 'opacity-100' : 'opacity-0'
            }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
}
