import { createCookie } from '@remix-run/node';

export const shoppingCartCookie = createCookie('shopping-cart', {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: true,
  expires: new Date(Date.now() + 60_000),
})

