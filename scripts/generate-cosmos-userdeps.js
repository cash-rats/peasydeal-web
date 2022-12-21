const { generateUserDepsModule } = require(
  "react-cosmos/dist/userDeps/generateUserDepsModule.js",
);
const { getCosmosConfigAtPath } = require(
  "react-cosmos/dist/config/getCosmosConfigAtPath",
);
const { join, relative, dirname } = require("path");
const { writeFileSync } = require("fs");

const config = getCosmosConfigAtPath(
  join(process.cwd(), "cosmos.config.json"),
);

const userdeps = generateUserDepsModule({
  cosmosConfig: config,
  rendererConfig: {},
  relativeToDir: relative(process.cwd(), dirname(config.userDepsFilePath)),
});

writeFileSync(config.userDepsFilePath, userdeps);