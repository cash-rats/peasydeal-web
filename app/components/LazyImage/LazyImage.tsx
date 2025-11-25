import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import './LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export function LazyImage({
  src,
  alt,
  className = '',
  placeholder = '/images/placeholder.svg'
}: LazyImageProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '500px',
  });
  const [loaded, setLoaded] = useState(false);

  return (
    <div ref={ref} className={className}>
      {inView ? (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${loaded ? 'lazy-image-loaded' : ''}`}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <img src={placeholder} alt="" className="lazy-image-placeholder" />
      )}
    </div>
  );
}
