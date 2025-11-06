import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes({
  ignoredRouteFiles: [
    "**/data/*.*",
    "**/.*",
    "**/*.css",
    "**/*.scss",
    "**/*.test.{js,jsx,ts,tsx}",
    "**/*.map",
    "**/styles/.*",
    "**/stub.*",
    "**/api/*.*",
    "**/api.*",
    "**/images/*.*",
    "**/assets/*.*"
  ],
}) satisfies RouteConfig;
