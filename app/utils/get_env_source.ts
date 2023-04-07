// Get endpoints according to different environment.


type AppConfig = {
  DOMAIN: string;
  MYFB_ENDPOINT: string;
  STRIPE_PUBLIC_KEY?: string;
  PEASY_DEAL_ENDPOINT?: string;
  CATEGORY_CACHE_TTL?: string;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CURRENCY_CODE?: string;
  STRIPE_PAYMENT_RETURN_URI?: string;
  STRIPE_CURRENCY_CODE?: string;
  CDN_URL?: string;
  GOOGLE_TAG_ID?: string;
  CONTENTFUL_SPACE_ID?: string;
  CONTENTFUL_ACCESS_TOKEN?: string;
};

declare global {
  interface Window {
    ENV: AppConfig;
    rudderanalytics?: any;
  }
}

const getEnvSource = (): any => {
  if (typeof window !== 'undefined') {
    return window.ENV;
  }

  return process.env;
}

const DOMAIN = getEnvSource()?.DOMAIN || 'https://staging.peasydeal.com';
const MYFB_ENDPOINT = getEnvSource()?.MYFB_ENDPOINT;
const PEASY_DEAL_ENDPOINT = getEnvSource()?.PEASY_DEAL_ENDPOINT;
const CATEGORY_CACHE_TTL = getEnvSource()?.CATEGORY_CACHE_TTL || 43200;
const CDN_URL = getEnvSource()?.CDN_URL || 'https://cdn.peasydeal.com';

const PAYPAL_CLIENT_ID = getEnvSource()?.PAYPAL_CLIENT_ID;
const PAYPAL_CURRENCY_CODE = getEnvSource()?.PAYPAL_CURRENCY_CODE;

const STRIPE_PUBLIC_KEY = getEnvSource()?.STRIPE_PUBLIC_KEY;
const STRIPE_PAYMENT_RETURN_URI = getEnvSource()?.STRIPE_PAYMENT_RETURN_URI;
const STRIPE_CURRENCY_CODE = getEnvSource()?.STRIPE_CURRENCY_CODE;

const GOOGLE_TAG_ID = getEnvSource()?.GOOGLE_TAG_ID;

const CONTENTFUL_SPACE_ID = getEnvSource()?.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = getEnvSource()?.CONTENTFUL_ACCESS_TOKEN;

const RUDDER_STACK_KEY = getEnvSource().RUDDER_STACK_KEY || '';
const RUDDER_STACK_URL = getEnvSource().RUDDER_STACK_URL || '';

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

  GOOGLE_TAG_ID,

  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ACCESS_TOKEN,

  RUDDER_STACK_KEY,
  RUDDER_STACK_URL,
};

export default getEnvSource