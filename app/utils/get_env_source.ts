// Get endpoints according to different environment.


type AppConfig = {
  STRIPE_PUBLIC_KEY: string;
  DOMAIN: string;
  MYFB_ENDPOINT: string;
};

declare global {
  interface Window {
    ENV: AppConfig;
  }
}

const getEnvSource = (): AppConfig => {
  if (typeof window !== 'undefined') {
    return window.ENV;
  }

  return process.env;
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

const GOOGLE_ANALYTICS_ID = getEnvSource().GOOGLE_ANALYTICS_ID;
const GOOGLE_TAG_ID = getEnvSource().GOOGLE_TAG_ID;
const POPTIN_ID = getEnvSource().POPTIN_ID;
const POPUPSMART_ID = getEnvSource().POPUPSMART_ID;

const CONTENTFUL_SPACE_ID = getEnvSource().CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = getEnvSource().CONTENTFUL_ACCESS_TOKEN;

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

  GOOGLE_ANALYTICS_ID,
  GOOGLE_TAG_ID,
  POPTIN_ID,
  POPUPSMART_ID,

  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ACCESS_TOKEN,
};

export default getEnvSource