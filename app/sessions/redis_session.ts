import invariant from 'tiny-invariant';

import { REDIS_SESSION_TTL } from '~/utils/get_env_source';

import { createRedisSessionStorage } from './create_redis_sessoin';

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const { getSession, commitSession, destroySession } = createRedisSessionStorage({
  cookie: {
    name: "__rsession",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    path: "/",
    httpOnly: true,
    maxAge: REDIS_SESSION_TTL,
  },
});
export { getSession, commitSession, destroySession };