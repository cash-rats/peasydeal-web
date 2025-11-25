import { createCookieSessionStorage } from 'react-router';

import cookie from '~/sessions/cookie';

const { getSession, commitSession, destroySession } = createCookieSessionStorage({ cookie });
export { getSession, commitSession, destroySession }
