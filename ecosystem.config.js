require('dotenv').config();

const shareConfigs = () => ({
  "PORT": process.env.PORT,
  "DOMAIN": process.env.DOMAIN,
  "CATEGORY_CACHE_TTL": process.env.CATEGORY_CACHE_TTL,
  "CDN_URL": process.env.CDN_URL,

  "DATABASE_URL": process.env.DATABASE_URL,
  "SESSION_SECRET": process.env.SESSION_SECRET,
  "MYFB_ENDPOINT": process.env.MYFB_ENDPOINT,
  "PEASY_DEAL_ENDPOINT": process.env.PEASY_DEAL_ENDPOINT,

  "PAYPAL_CLIENT_ID": process.env.PAYPAL_CLIENT_ID,
  "PAYPAL_CURRENCY_CODE": process.env.PAYPAL_CURRENCY_CODE,

  "STRIPE_PRIVATE_KEY": process.env.STRIPE_PRIVATE_KEY,
  "STRIPE_PUBLIC_KEY": process.env.STRIPE_PUBLIC_KEY,
  "STRIPE_PAYMENT_RETURN_URI": process.env.STRIPE_PAYMENT_RETURN_URI,
  "STRIPE_CURRENCY_CODE": process.env.STRIPE_CURRENCY_CODE,

  "GOOGLE_MAP_API_KEY": process.env.GOOGLE_MAP_API_KEY,

  "REDIS_HOST": process.env.REDIS_HOST,
  "REDIST_PORT": process.env.REDIST_PORT,

  "GOOGLE_TAG_ID": process.env.GOOGLE_TAG_ID,

  "CONTENTFUL_SPACE_ID": process.env.CONTENTFUL_SPACE_ID,
  "CONTENTFUL_ACCESS_TOKEN": process.env.CONTENTFUL_ACCESS_TOKEN,

  "RUDDER_STACK_KEY": process.env.RUDDER_STACK_KEY,
  "RUDDER_STACK_URL": process.env.RUDDER_STACK_URL,

  "ALGOLIA_APP_ID": process.env.ALGOLIA_APP_ID,
  "ALGOLIA_APP_WRITE_KEY": process.env.ALGOLIA_APP_WRITE_KEY,
  "ALGOLIA_INDEX_NAME": process.env.ALGOLIA_INDEX_NAME,

  "GCS_KEY_NAME": process.env.GCS_KEY_NAME,
  "GCS_BUCKET_NAME": process.env.GCS_BUCKET_NAME,
});

module.exports = {
  apps: [
    {
      name: "peasydeal_web",
      script: "npm",
      watch: true,
      args: "start",
      env_local: {
        "NODE_ENV": "development",
        ...shareConfigs(),
      },

      env_staging: {
        "NODE_ENV": "staging",
        ...shareConfigs(),
      },

      env_production: {
        "NODE_ENV": "production",
        ...shareConfigs(),
      },
    },
  ],
}
