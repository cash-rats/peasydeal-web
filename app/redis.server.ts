import type { RedisOptions, Redis } from 'ioredis';
import IORedis from 'ioredis';

let ioredis: Redis;
const options: RedisOptions = {
  port: Number(process.env.REDIST_PORT),
  host: process.env.REDIS_HOST,
}

declare global {
  var __redis__: Redis;
}

if (process.env.NODE_ENV === 'production') {
  ioredis = new IORedis(options);
} else {
  if (!global.__redis__) {
    global.__redis__ = new IORedis(options);
  }
  ioredis = global.__redis__;
}

export { ioredis };
