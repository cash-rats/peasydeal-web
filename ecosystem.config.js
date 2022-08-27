module.exports = {
  app: [
    {
      script: "npm",
      watch: true,
      args: "start",
      env: {
        "PORT": 3000,
        "NODE_ENV": "development",
        "DATABASE_URL": "file:./data.db?connection_limit=1",
        "SESSION_SECRET": "4f8d522276ae65a7d1db347b98b6185a",
      },

      env_production: {
        "PORT": 3000,
        "NODE_ENV": "production",
        "DATABASE_URL": "file:./data.db?connection_limit=1",
        "SESSION_SECRET": "4f8d522276ae65a7d1db347b98b6185a",
      },
    },
  ],
}
