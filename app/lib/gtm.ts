export type GTMEventParams = Record<string, unknown>;

export function trackEvent(event: string, params: GTMEventParams = {}) {
  if (typeof window === 'undefined') return;

  const dataLayer = ((window as any).dataLayer ||= []);
  if (Array.isArray(dataLayer)) {
    dataLayer.push({ event, ...params });
  }

  const rudderanalytics = (window as any).rudderanalytics;
  if (!rudderanalytics) return;

  if (Array.isArray(rudderanalytics)) {
    rudderanalytics.push(['track', event, params]);
    return;
  }

  if (typeof rudderanalytics.track === 'function') {
    rudderanalytics.track(event, params);
  }
}
