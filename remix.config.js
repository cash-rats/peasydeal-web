/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  serverDependenciesToBundle: [
    'yet-another-react-lightbox',
    'yet-another-react-lightbox/plugins/thumbnails'
  ],
  ignoredRouteFiles: [
    "**/.*",
    "**/*.css",
    "**/*.scss",
    "**/*.test.{js,jsx,ts,tsx}",
    "**/*.map",
    "**/data/*.*",
    "**/styles/.*",
    "**/stub.*",
    "**/api/*.*",
    "**/api.*",
    "**/images/*.*",
    "**/assets/*.*"
  ],
  future: { v2_meta: true },
};
