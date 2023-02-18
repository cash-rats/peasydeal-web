// Get endpoints according to different environment.
declare global {
  interface Window {
    ENV: {
      ENV: {
        STRIPE_PUBLIC_KEY: string;
        DOMAIN: string;
      }
    }
  }
}

const getEnvSource = () => {
  if (typeof window !== 'undefined') {
    return window.ENV;
  }
  return process.env
}

const DOMAIN = getEnvSource().DOMAIN || 'https://staging.peasydeal.com';
const MYFB_ENDPOINT = getEnvSource().MYFB_ENDPOINT;
const PEASY_DEAL_ENDPOINT = getEnvSource().PEASY_DEAL_ENDPOINT
const CATEGORY_CACHE_TTL = getEnvSource().CATEGORY_CACHE_TTL || 43200;
const CDN_URL = getEnvSource().CDN_URL || 'https://cdn.peasydeal.com';

const PAYPAL_CLIENT_ID = getEnvSource().PAYPAL_CLIENT_ID;
const PAYPAL_CURRENCY_CODE = getEnvSource().PAYPAL_CURRENCY_CODE;

const STRIPE_PUBLIC_KEY = getEnvSource().STRIPE_PUBLIC_KEY;
const STRIPE_PAYMENT_RETURN_URI = getEnvSource().STRIPE_PAYMENT_RETURN_URI;
const STRIPE_CURRENCY_CODE = getEnvSource().STRIPE_CURRENCY_CODE;

export {
  DOMAIN,
  MYFB_ENDPOINT,
  PEASY_DEAL_ENDPOINT,
  CATEGORY_CACHE_TTL,
  CDN_URL,

  PAYPAL_CLIENT_ID,
  PAYPAL_CURRENCY_CODE,

  STRIPE_PUBLIC_KEY,
  STRIPE_PAYMENT_RETURN_URI,
  STRIPE_CURRENCY_CODE,
};

export default getEnvSource