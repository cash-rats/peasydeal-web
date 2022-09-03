const path = require('path');

module.exports = (webpackConfig, env) => {
  webpackConfig.module.rules[0] = {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    options: {
      configFile: 'cosmos.tsconfig.json',
    },
  }

  const overrideWebpack = {
    ...webpackConfig,
    resolve: {
      ...webpackConfig.resolve,
      alias: {
        ...webpackConfig.resolve.alias,
        '~': path.resolve(__dirname, 'app/'),
      },
    },
  };


  return overrideWebpack;
};



