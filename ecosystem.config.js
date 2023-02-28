require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "peasydeal_web",
      script: "npm",
      watch: true,
      args: "start",
      env_local: {
        "PORT": process.env.PORT,
        "DOMAIN": process.env.DOMAIN,
        "NODE_ENV": "development",
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

        "REDIS_HOST": process.env.REDIS_HOST,
        "REDIST_PORT": process.env.REDIST_PORT,

        "GOOGLE_ANALYTICS_ID": process.env.GOOGLE_ANALYTICS_ID,
        "GOOGLE_TAG_ID": process.env.GOOGLE_TAG_ID,

        "CONTENTFUL_SPACE_ID": process.env.CONTENTFUL_SPACE_ID,
        "CONTENTFUL_ACCESS_TOKEN": process.env.CONTENTFUL_ACCESS_TOKEN,
      },

      env_staging: {
        "PORT": process.env.PORT,
        "DOMAIN": process.env.DOMAIN,
        "NODE_ENV": "staging",
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

        "REDIS_HOST": process.env.REDIS_HOST,
        "REDIST_PORT": process.env.REDIST_PORT,

        "GOOGLE_ANALYTICS_ID": process.env.GOOGLE_ANALYTICS_ID,
        "GOOGLE_TAG_ID": process.env.GOOGLE_TAG_ID,

        "CONTENTFUL_SPACE_ID": process.env.CONTENTFUL_SPACE_ID,
        "CONTENTFUL_ACCESS_TOKEN": process.env.CONTENTFUL_ACCESS_TOKEN,
      },

      env_production: {
        "PORT": process.env.PORT,
        "DOMAIN": process.env.DOMAIN,
        "NODE_ENV": "production",
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

        "REDIS_HOST": process.env.REDIS_HOST,
        "REDIST_PORT": process.env.REDIST_PORT,

        "GOOGLE_ANALYTICS_ID": process.env.GOOGLE_ANALYTICS_ID,
        "GOOGLE_TAG_ID": process.env.GOOGLE_TAG_ID,

        "CONTENTFUL_SPACE_ID": process.env.CONTENTFUL_SPACE_ID,
        "CONTENTFUL_ACCESS_TOKEN": process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    },
  ],
}
