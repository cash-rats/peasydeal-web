import { useEffect, useRef, useCallback } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/v2/Button/Button";
import { Spinner } from "~/components/v2/Spinner";

/* ------------------------------------------------------------------ */
/*  InfiniteScroll — IntersectionObserver-based scroll detection        */
/* ------------------------------------------------------------------ */

export interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  /** IntersectionObserver rootMargin. Default "200px" */
  threshold?: string;
  children: React.ReactNode;
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  threshold = "200px",
  children,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(onLoadMore);
  loadMoreRef.current = onLoadMore;

  useEffect(() => {
    if (!hasMore || loading) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreRef.current();
        }
      },
      { rootMargin: threshold }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, threshold]);

  return (
    <>
      {children}
      {hasMore && <div ref={sentinelRef} className="h-px" aria-hidden="true" />}
      {loading && (
        <div className="py-8 text-center">
          <Spinner size="md" className="mx-auto text-rd-text-secondary" />
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  LoadMoreButton — styled v2 button for manual load-more             */
/* ------------------------------------------------------------------ */

export interface LoadMoreButtonProps {
  loading?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function LoadMoreButton({
  loading = false,
  onClick,
  children = "Load More",
  className,
}: LoadMoreButtonProps) {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      isLoading={loading}
      className={cn("block mx-auto mt-8", className)}
    >
      {children}
    </Button>
  );
}
