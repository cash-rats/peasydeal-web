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
  if (typeof window !== 'undefined') return window.ENV.ENV;
  return process.env
}

const DOMAIN = getEnvSource().DOMAIN;
const MYFB_ENDPOINT = getEnvSource().MYFB_ENDPOINT;
const PEASY_DEAL_ENDPOINT = getEnvSource().PEASY_DEAL_ENDPOINT

const PAYPAL_CLIENT_ID = getEnvSource().PAYPAL_CLIENT_ID;
const PAYPAL_CURRENCY_CODE = getEnvSource().PAYPAL_CURRENCY_CODE;

const STRIPE_PUBLIC_KEY = getEnvSource().STRIPE_PUBLIC_KEY;
const STRIPE_PAYMENT_RETURN_URI = getEnvSource().STRIPE_PAYMENT_RETURN_URI;
const STRIPE_CURRENCY_CODE = getEnvSource().STRIPE_CURRENCY_CODE;

export {
  DOMAIN,
  MYFB_ENDPOINT,
  PEASY_DEAL_ENDPOINT,

  PAYPAL_CLIENT_ID,
  PAYPAL_CURRENCY_CODE,

  STRIPE_PUBLIC_KEY,
  STRIPE_PAYMENT_RETURN_URI,
  STRIPE_CURRENCY_CODE,
};

export default getEnvSource