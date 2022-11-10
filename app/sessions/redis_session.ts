import cookie from './cookie';
import { createRedisSessionStorage } from './create_redis_sessoin';

const { REDIS_HOST, REDIST_PORT } = process.env;

const { getSession, commitSession, destroySession } = createRedisSessionStorage({
  cookie,
  options: {
    redisConfig: {
      port: Number(REDIST_PORT),
      host: REDIS_HOST,
    }
  }
});

export { getSession, commitSession, destroySession };