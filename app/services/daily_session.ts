const DAILY_SESSION_KEY = 'ga_session';

/*
 * Store sessionID in session storage for client-side analytics use.
 */
export function storeSessionIDToSessionStore(sessionID: string) {
  window?.sessionStorage?.setItem(DAILY_SESSION_KEY, sessionID);
}

/**
 * Retrieve daily session ID from session storage.
 */
export function getSessionIDFromSessionStore(): string | null {
  return window?.sessionStorage?.getItem(DAILY_SESSION_KEY);
};
