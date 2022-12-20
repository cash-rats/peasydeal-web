const path = require("path");

module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../app/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },

  // @see https://stackoverflow.com/questions/71158775/storybook-couldnt-resolve-fs
  webpackFinal: async (config, { configType }) => {
    const cssRule = config.module.rules.find(rule => rule.test.toString().includes('css'));

    // Change the `option` in css loader rule.
    const cssLoaderRule = cssRule.use.find(rule => {
      if (typeof rule === 'object' && rule.loader) {
        return rule.loader.includes('css-loader')
      }
      return false;
    });

    config.resolve = {
      ...config.resolve,
      fallback: {
        ...(config.resolve || {}).fallback,
        fs: false,
        stream: false,
        os: false,
        dns: false,
        net: false,
        tls: false,
      },
    }

    // Return the altered config
    return config
  },
}
