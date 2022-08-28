# PeasyDeal Web

## Start dev

`npm run dev`

## Start React Cosmos

**react-cosmos** is a UI sandbox for developing UI component in isolation.

```
npm run cosmos
```

sandbox will be hosted on `localhost:5001` specified in `./cosmos.config.json`

## Styled component SSR checksome BUG

styled component on remix run would lead to `componentId` difference between server and client side, [check the issue here](https://github.com/remix-run/remix/issues/1032). Thus, we need [babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components)

bable plugin to fix this issue. However, remix official does not want any babel solution but comeup with the solution by it's own. So the community comes up with the following 2 plugins

 - https://github.com/lukalabs/lukalabs-npm/tree/main/packages/esbuild-inject-plugin
 - https://github.com/lukalabs/lukalabs-npm/blob/main/packages/esbuild-inject-plugin/index.js

 to fix this issue.

## SCSS


## Routes

** / ** :
	Home route with list of products.

** /$prod_id **
	Product route with product detail.
