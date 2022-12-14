import type { SessionIdStorageStrategy, SessionStorage } from "@remix-run/server-runtime";
import { createSessionStorage } from '@remix-run/node';

import type { RedisOptions, Redis } from 'ioredis';
import crypto from "crypto";
import IORedis from "ioredis";

import { ioredis as redis } from '~/redis.server';

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

type RedisSessionArguments = {
  cookie: SessionIdStorageStrategy["cookie"];
};

export function createRedisSessionStorage({ cookie }: RedisSessionArguments): SessionStorage {
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