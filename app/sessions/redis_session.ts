import { createRedisSessionStorage } from './create_redis_sessoin';
import invariant from 'tiny-invariant';

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const { getSession, commitSession, destroySession } = createRedisSessionStorage({
  cookie: {
    name: "__rsession",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    path: "/",
    httpOnly: true,
  },

});
export { getSession, commitSession, destroySession };