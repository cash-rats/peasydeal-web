import { createCookieSessionStorage } from '@remix-run/node';

import cookie from '~/sessions/cookie';

const { getSession, commitSession, destroySession } = createCookieSessionStorage({ cookie });
export { getSession, commitSession, destroySession }
