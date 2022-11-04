import { getSession } from '~/sessions';

export const getCookieSession = async (request: Request): Promise<Session> => {
  return await getSession(request.headers.get("Cookie"));
}