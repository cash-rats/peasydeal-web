const styledComponentsPlugin = require('@lukalabs/esbuild-styled-components').default;

exports.plugins = function(plugins) {
  return [styledComponentsPlugin({
    ssr: true,
    namespace: 'peasydeal',
  }), ...plugins];
}
