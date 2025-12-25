export type GTMEventParams = Record<string, unknown>;

export function trackEvent(event: string, params: GTMEventParams = {}) {
  if (typeof window === 'undefined') return;

  const normalizedEvent = event.startsWith('pd_') ? event : `pd_${event}`;

  const rudderanalytics = ((window as any).rudderanalytics ||= []);

  if (Array.isArray(rudderanalytics)) {
    rudderanalytics.push(['track', normalizedEvent, params]);
    return;
  }

  if (typeof rudderanalytics.track === 'function') {
    rudderanalytics.track(normalizedEvent, params);
  }
}
