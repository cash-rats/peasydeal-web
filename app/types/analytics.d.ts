export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    ENV?: Record<string, unknown>;
    RudderSnippetVersion?: string;
    rudderAnalyticsBuildType?: 'legacy' | 'modern';
    rudderanalytics?: unknown[] | Record<string, unknown>;
  }
}
