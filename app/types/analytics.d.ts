export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    ENV?: Record<string, unknown>;
  }
}
