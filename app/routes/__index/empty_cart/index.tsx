import type { LinksFunction } from '@remix-run/node';
import EmptyShoppingCartPage, { links as EmptyShoppingCartPageLinks } from "./components/EmptyShoppingCart";

export const links: LinksFunction = () => {
  return [...EmptyShoppingCartPageLinks()];
}

export default function EmptyCart() {
  return (
    <>
      <EmptyShoppingCartPage />
    </>
  );
}