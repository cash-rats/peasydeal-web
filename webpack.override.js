// webpack.override.js
module.exports = (webpackConfig, env) => {
  console.log('webpack.override', webpackConfig)
  return { ...webpackConfig /* do your thing */ };
};



