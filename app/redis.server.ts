import type { RedisOptions, Redis } from 'ioredis';
import IORedis from 'ioredis';

let ioredis: Redis;
let options: RedisOptions = {
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
}
declare global {
  var __redis__: Redis;
}

if (process.env.NODE_ENV === 'production') {
  ioredis = new IORedis(options);
} else {
  if (process.env.NODE_ENV === 'test') {
    options = {
      port: 6379,
      host: '127.0.0.1',
    }
  }

  if (!global.__redis__) {
    global.__redis__ = new IORedis(options);
  }
  ioredis = global.__redis__;
}

export { ioredis };
