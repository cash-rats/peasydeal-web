const path = require('path');

module.exports = async ({ config }) => {
  const fileLoaderRule = config.module.rules.find(rule => rule.test.test('.svg'));
  fileLoaderRule.exclude = /\.svg$/;
  config.module.rules.push({
    test: /\.svg$/,
    use: ["@svgr/webpack", "url-loader"],
  });

  // Resolve path alias.
  config.resolve.alias = {
    ...config.resolve?.alias,
    '~': path.resolve(__dirname, '../app'),
  };

  return config;
};