import type { SessionIdStorageStrategy, SessionStorage } from "@remix-run/server-runtime";
import { createSessionStorage } from '@remix-run/node';

import type { RedisOptions, Redis } from 'ioredis';

import crypto from "crypto";
import IORedis from "ioredis";

function genRandomID(): string {
  const randomBytes = crypto.randomBytes(8);
  return Buffer.from(randomBytes).toString("hex");
}

const expiresToSeconds = (expires: Date) => {
  const now = new Date();
  const expiresDate = new Date(expires);
  const secondsDelta = Math.floor((expiresDate.getTime() - now.getTime()) / 1000);
  return secondsDelta < 0 ? 0 : secondsDelta;
};

type redisSessionArguments = {
  cookie: SessionIdStorageStrategy["cookie"];
  options: {
    redisConfig?: RedisOptions,
    redisClient?: Redis
  }
};

export function createRedisSessionStorage({
  cookie,
  options
}: redisSessionArguments): SessionStorage {
  let redis: Redis
  if (options.redisClient) {
    redis = options.redisClient
  } else if (options.redisConfig) {
    redis = new IORedis(options.redisConfig);
  } else {
    throw new Error("Need to provide either options.RedisConfig or options.redisClient")
  }

  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const id = genRandomID();
      if (expires) {
        await redis.set(
          id,
          JSON.stringify(data),
          "EX",
          expiresToSeconds(expires)
        );
      } else {
        await redis.set(id, JSON.stringify(data));
      }
      return id;
    },
    async readData(id) {
      const data = await redis.get(id);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    },
    async updateData(id, data, expires) {
      if (expires) {
        await redis.set(
          id,
          JSON.stringify(data),
          "EX",
          expiresToSeconds(expires)
        );
      } else {
        await redis.set(id, JSON.stringify(data));
      }
    },
    async deleteData(id) {
      await redis.del(id);
    },
  });
}