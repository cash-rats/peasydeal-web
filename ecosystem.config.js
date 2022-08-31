require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "peasydeal_web",
      script: "npm",
      watch: true,
      args: "start",
      env: {
        "PORT": 3000,
        "NODE_ENV": "development",
        "DATABASE_URL": process.env.DATABASE_URL,
        "SESSION_SECRET": process.env.SESSION_SECRET,
        "MYFB_ENDPOINT": process.env.MYFB_ENDPOINT,
      },

      env_staging: {
        "PORT": 3000,
        "NODE_ENV": "staging",
        "DATABASE_URL": process.env.DATABASE_URL,
        "SESSION_SECRET": process.env.SESSION_SECRET,
        "MYFB_ENDPOINT": process.env.MYFB_ENDPOINT,
      },

      env_production: {
        "PORT": 3000,
        "NODE_ENV": "production",
        "DATABASE_URL": process.env.DATABASE_URL,
        "SESSION_SECRET": process.env.SESSION_SECRET,
        "MYFB_ENDPOINT": process.env.MYFB_ENDPOINT,
      },
    },
  ],
}
