// Get endpoints according to different environment.
type AppConfig = {
  DOMAIN: string;
  MYFB_ENDPOINT: string;
  STRIPE_PUBLIC_KEY?: string;
  CDN_URL?: string;
  PEASY_DEAL_ENDPOINT?: string;
  CATEGORY_CACHE_TTL?: string;

  REDIS_SESSION_TTL?: string;

  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CURRENCY_CODE?: string;

  STRIPE_PAYMENT_RETURN_URI?: string;
  STRIPE_CURRENCY_CODE?: string;

  GOOGLE_TAG_ID?: string;

  CONTENTFUL_SPACE_ID?: string;
  CONTENTFUL_ACCESS_TOKEN?: string;

  ALGOLIA_APP_ID: string;
  ALGOLIA_APP_WRITE_KEY: string;
  ALGOLIA_INDEX_NAME: string;
};

declare global {
  interface Window {
    ENV: AppConfig;
    rudderanalytics?: any;
  }
}

const getENVSource = (): any => {
  return typeof window !== 'undefined'
    ? window.ENV
    : process.env
}

const getENV = (key: string): string | null | undefined => getENVSource()[key]

const DOMAIN = getENV('DOMAIN') || 'https://staging.peasydeal.com';
const MYFB_ENDPOINT = getENV('MYFB_ENDPOINT');
const PEASY_DEAL_ENDPOINT = getENV('PEASY_DEAL_ENDPOINT') || 'https://stagingapi.peasydeal.com';

const REDIS_SESSION_TTL = Number(getENV('REDIS_SESSION_TTL')) || 295200;
const CATEGORY_CACHE_TTL = getENV('CATEGORY_CACHE_TTL') || 43200;
const CDN_URL = getENV('CDN_URL') || 'https://cdn.peasydeal.com';

const PAYPAL_CLIENT_ID = getENV('PAYPAL_CLIENT_ID');
const PAYPAL_CURRENCY_CODE = getENV('PAYPAL_CURRENCY_CODE');

const STRIPE_PUBLIC_KEY = getENV('STRIPE_PUBLIC_KEY');
const STRIPE_PAYMENT_RETURN_URI = getENV('STRIPE_PAYMENT_RETURN_URI');
const STRIPE_CURRENCY_CODE = getENV('STRIPE_CURRENCY_CODE');

const GOOGLE_TAG_ID = getENV('GOOGLE_TAG_ID');

const CONTENTFUL_SPACE_ID = getENV('CONTENTFUL_SPACE_ID');
const CONTENTFUL_ACCESS_TOKEN = getENV('CONTENTFUL_ACCESS_TOKEN');

const RUDDER_STACK_KEY = getENV('RUDDER_STACK_KEY') || '';
const RUDDER_STACK_URL = getENV('RUDDER_STACK_URL') || '';

const ALGOLIA_APP_ID = getENV('ALGOLIA_APP_ID') || '';
const ALGOLIA_APP_WRITE_KEY = getENV('ALGOLIA_APP_WRITE_KEY') || '';
const ALGOLIA_INDEX_NAME = getENV('ALGOLIA_INDEX_NAME') || '';

export {
  DOMAIN,
  MYFB_ENDPOINT,
  PEASY_DEAL_ENDPOINT,
  REDIS_SESSION_TTL,
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

  ALGOLIA_APP_ID,
  ALGOLIA_APP_WRITE_KEY,
  ALGOLIA_INDEX_NAME,
};

export default getENVSource