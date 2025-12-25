import { useEffect } from 'react';
import { useLocation } from 'react-router';

type UseGoogleAnalyticsParams = {
  env?: string | null | undefined;
  measurementId?: string | null | undefined;
  sessionId?: string | null | undefined;
};

export default function useGoogleAnalytics({
  env,
  measurementId,
  sessionId,
}: UseGoogleAnalyticsParams) {
  const location = useLocation();

  useEffect(() => {
    if (!env || env !== 'production' || !measurementId) return;
    if (typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'page_view', {
      page_path: `${location.pathname}${location.search}${location.hash}`,
      page_location: window.location.href,
      page_title: document.title,
      ...(sessionId ? { peasy_session_id: sessionId } : {}),
    });
  }, [
    env,
    measurementId,
    sessionId,
    location.pathname,
    location.search,
    location.hash,
  ]);
}
