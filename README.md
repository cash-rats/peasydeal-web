# PeasyDeal Web

testing

## Start dev

`npm run dev`

## Stroybook

`npm run storybook`

## Start React Cosmos~~

**react-cosmos** is a UI sandbox for developing UI component in isolation.

```
npm run cosmos
```

sandbox will be hosted on `localhost:5001` specified in `./cosmos.config.json`
## ~~Styled component SSR checksome BUG~~

styled component on remix run would lead to `componentId` difference between server and client side, [check the issue here](https://github.com/remix-run/remix/issues/1032). Thus, we need [babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components)

bable plugin to fix this issue. However, remix official does not want any babel solution but comeup with the solution by it's own. So the community comes up with the following 2 plugins

 - https://github.com/lukalabs/lukalabs-npm/tree/main/packages/esbuild-inject-plugin
 - https://github.com/lukalabs/lukalabs-npm/blob/main/packages/esbuild-inject-plugin/index.js

 to fix this issue.

## SCSS

### Responsive mechansim

[variable and mixin](https://medium.com/codeartisan/breakpoints-and-media-queries-in-scss-46e8f551e2f2)

## URL friendly product detail URL

### wowcher's approach
`https://peasydeal.com/product/7704904335598/Portable-and-Foldable-Sunglasses-Organizer-Multi-slot-Storage-Box`

### shopee's approach
`https://shopee.tw/%EF%BC%BB%E9%A0%90%E8%B3%BC%E5%95%86%E5%93%81-3%E6%AC%BE%E4%BB%BB%E9%81%B8-64GB-256GB-512GB-Steam-Deck-%E4%B8%BB%E6%A9%9F-i.14272792.16523171041?sp_atk=5fa92289-5e4b-4939-84e6-8faabd578545&xptdk=5fa92289-5e4b-4939-84e6-8faabd578545`

we'll be copying shopee's approach

`https://peasydeal.com/product/some-google-product-i.{VARIATION_UID}`
## Routes

`/` :
Home route with list of products.

`/$collection`:
Products of given category. e.g. `/Hot%20Deal` `/SexToy`

`/$prod_id`
	Product route with product detail

## Folder structure
[folder structure](https://blog.webdevsimplified.com/2022-07/react-folder-structure/)

## Disable restoring scroll position

We can specify `scrollToTop: true` in `Link` component of remix:

```tsx
<Link state={{ scrollToTop: true }} to="path_B">
```

`ConditionalScrollRestoration` component would know that the next route redirected by this `Link`
need to scroll to top. Thus, scroll restoration won't happen when we redirect from `path_A` to `path_B`.

## How to implement route changing progress bar?

https://sergiodxa.com/articles/use-nprogress-in-a-remix-app
https://dev.to/gugaguichard/add-a-global-progress-indicator-to-your-remix-app-2m52


## 404 Not Found Page

### Global Not found page

`/some/path/nothere` :

```
app
	|--- route
	       |--- $.tsx
```

### Category not found page
`/some-cat`

app
	|--- route
	       |--- $collection#CatchBoundary

### Product not found page

`/product/some-product`

app
	|--- route
	       |--- __index
				          |--- product
									        | --- $prodid#CatchBoundary

https://developers.google.com/search/docs/appearance/structured-data/search-gallery

### Paypal react SDK

https://www.npmjs.com/package/@paypal/react-paypal-js?activeTab=readme
## Misc

- [Remix cosmos integration](https://dev.to/rzmz/react-cosmos-with-remix-7go)
- [react-cosmos mock routes in Remix](https://www.vixalien.com/blog/remix-in-the-cosmos)
- [Name color][find name of a color](https://colors.artyclick.com/color-name-finder/)
- [web icons generator](https://realfavicongenerator.net/)
- [Remix error catching](https://codegino.com/blog/remix-error-handling)