import cookie from './cookie';
import { createRedisSessionStorage } from './create_redis_sessoin';

const { getSession, commitSession, destroySession } = createRedisSessionStorage({ cookie });
export { getSession, commitSession, destroySession };