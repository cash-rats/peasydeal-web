const DAILY_SESSION_KEY = 'ga_session';

/*
 * Store sessionID to session store. we'll send this ID
 * to google analytics to observe actions during given
 * session.
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