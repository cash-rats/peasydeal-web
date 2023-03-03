import invariant from 'tiny-invariant';
import { add } from 'date-fns';

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

    // Invalidates product list pagination cache and shopping cart every 3 days.
    expires: add(new Date(), {
      days: 3,
    }),
  },

});
export { getSession, commitSession, destroySession };