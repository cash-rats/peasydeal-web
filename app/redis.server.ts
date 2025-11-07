import IORedis, {
  type RedisOptions,
  type Redis,
} from 'ioredis';

import { env, isProd } from '~/utils/env';

let ioredis: Redis;
let options: RedisOptions = {
  port: env.REDIS_PORT,
  host: env.REDIS_HOST,
  username: env.REDIS_USER,
  password: env.REDIS_PASSWORD,
  db: env.REDIS_DB,
}

declare global {
  var __redis__: Redis;
}

if (isProd) {
  ioredis = new IORedis(options);
} else {
  if (process.env.NODE_ENV === 'test') {
    options = {
      port: 6379,
      host: '127.0.0.1',
      db: 0,
    }
  }

  if (!global.__redis__) {
    global.__redis__ = new IORedis(options);
  }
  ioredis = global.__redis__;
}

export { ioredis };
