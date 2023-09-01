import { format } from 'date-fns';

import { ioredis as redis } from '~/redis.server';

const getTodayDate = () => format(new Date(), 'y-M-d');

/**
 * Store daily activity sessions to redis list with today's
 * date as key. SessionIDs as list value.
 */
export async function storeDailySession(sessionID: string) {
  await redis.lpush(getTodayDate(), sessionID);
};

