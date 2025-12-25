export type GTMEventParams = Record<string, unknown>;

export function trackEvent(event: string, params: GTMEventParams = {}) {
  if (typeof window === 'undefined') return;

  const normalizedEvent = event.startsWith('pd_') ? event : `pd_${event}`;
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  dataLayer.push({
    ...params,
    event: normalizedEvent,
  });
}
