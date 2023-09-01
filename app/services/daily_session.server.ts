/**
 * This API retreive session id from server. Frontend would
 * store the session id to session storage for the usage of
 * GA event. At least we can track series of actions from
 * the current user session.
 */

import { format } from 'date-fns';
import crypto from 'crypto';

import { ioredis as redis } from '~/redis.server';

export const getGASessionID = () => {
  const randomBytes = crypto.randomBytes(10)
  return randomBytes.toString('base64');
}

const getTodayDate = () => format(new Date(), 'y_M_d');

/**
 * Store daily activity sessions to redis list with today's
 * date as key. SessionIDs as list value.
 */
export async function storeDailySession(): Promise<string> {
  const gaSessionID = getGASessionID();
  await redis.lpush(getTodayDate(), gaSessionID);
  return gaSessionID;
};

