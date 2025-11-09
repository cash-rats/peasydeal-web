import type { Session } from 'react-router';

import { getSession } from '~/sessions/redis_session.server';

export const getCookieSession = async (request: Request): Promise<Session> => {
  return await getSession(request.headers.get("Cookie"));
}
