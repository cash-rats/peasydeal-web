/**
 * This API retreive session id from server. Frontend would
 * store the session id to session storage for the usage of
 * GA event. At least we can track series of actions from
 * the current user session.
 */
import crypto from 'crypto';

export const getGASessionID = () => {
  const randomBytes = crypto.randomBytes(10)
  return randomBytes.toString('base64');
}