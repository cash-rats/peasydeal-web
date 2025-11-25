## Cart Route Structure Plan

1. **Convert cart layout to use `CatalogLayout`**
   - `app/routes/cart.tsx` should import `CatalogLayout` (and its `links`) instead of manually wiring header/footer/search.
   - The loader/meta behavior remains, but the layout component wraps `<Outlet />` and the recommended products section inside `<CatalogLayout>` so nested child routes inherit the shell.
2. **Keep nested route focused on cart UI**
   - `app/routes/cart/route.tsx` should only render the cart content (no header/footer). Remove the temporary `CatalogLayout` wrapper added earlier.
   - Ensure it still exports `links`, `loader`, `action`, etc., and relies on the parent layout for shared styles.
3. **Verify nested-data usage**
   - Confirm `useRouteLoaderData('root')` still provides `cartCount`.
   - Make sure `links()` in both layout and child include only what they own (layout pulls `CatalogLayoutLinks`, child keeps PriceResult/Quantity dependencies).
