import { useInView } from 'react-intersection-observer';
import type { ReactNode } from 'react';

interface LazyWrapperProps {
  children: ReactNode;
  threshold?: number;
}

export function LazyWrapper({ children, threshold = 500 }: LazyWrapperProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: `${threshold}px`,
  });

  return (
    <div ref={ref}>
      {inView ? children : <div className="h-full w-full bg-gray-200" />}
    </div>
  );
}
