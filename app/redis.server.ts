import IORedis, { type Redis, } from 'ioredis';
import { env } from '~/utils/env';

let ioredis: Redis;
declare global {
  var __redis__: Redis;
}

const dsn = `rediss://${env.REDIS_USER}:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`;
ioredis = new IORedis(dsn);
ioredis = global.__redis__;

export { ioredis };
