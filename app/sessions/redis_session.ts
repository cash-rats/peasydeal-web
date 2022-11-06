import cookie from './cookie';

import { createRedisSessionStorage } from './create_redis_sessoin';

const { getSession, commitSession, destroySession } = createRedisSessionStorage({
  cookie,
  options: {
    redisConfig: {
      port: 6379,
      host: '127.0.0.1'
    }
  }
});

export { getSession, commitSession, destroySession };