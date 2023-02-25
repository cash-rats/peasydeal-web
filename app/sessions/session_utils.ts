import type { Session } from '@remix-run/node';

import { getSession } from '~/sessions/redis_session';

export const getCookieSession = async (request: Request): Promise<Session> => {
  return await getSession(request.headers.get("Cookie"));
}