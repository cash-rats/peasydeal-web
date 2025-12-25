export type GTMEventParams = Record<string, unknown>;

export function trackEvent(event: string, params: GTMEventParams = {}) {
  if (typeof window === 'undefined') return;

  const dataLayer = (window.dataLayer = window.dataLayer || []);
  dataLayer.push({
    ...params,
    event,
  });
}

