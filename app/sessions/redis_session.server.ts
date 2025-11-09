import invariant from 'tiny-invariant';

import { envs } from '~/utils/env';

import { createRedisSessionStorage } from './create_redis_session.server';

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const { getSession, commitSession, destroySession } = createRedisSessionStorage({
  cookie: {
    name: "__rsession",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    path: "/",
    httpOnly: true,
    maxAge: envs.REDIS_SESSION_TTL,
  },
});
export { getSession, commitSession, destroySession };