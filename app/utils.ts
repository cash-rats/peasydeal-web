import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}


export const checkHasMoreRecord = (count: number, divisor: number) => count % divisor === 0;

export const getCanonicalDomain = (request: Request): string => {
  const url = new URL(request.url);
  let domain = `${url.protocol}//${url.hostname}`
  if (url.port) {
    domain = `${domain}:${url.port}`
  }
  return domain
};

// SEO index page
export const getIndexTitleText = () => 'peasydeal.com | premium selected car accessories, gadgets, home & gardening products, clothes and more at a great price!';
export const getIndexDescText = () => `PeasyDeal makes your shopping experience a breeze. Premium selected solar-powered lights, gadgets, home & gardening products, apparel and more at a best price possible. Responsive customer service, fast processing and shipping time.`;

// SEO collection page
export const getCollectionTitleText = (category: string) => `${category} | peasydeal.com`;
export const getCollectionDescText = (category: string) => `${category} | Hot Deals | Shop for Hot Deals and more at everyday discount price with FREE SHIPPING on all Products to celebrate PeasyDeal's Grant Opening!!`;

// SEO prod page
export const getProdDetailTitleText = (title: string, uuid: string) => `${title} - peasydeal.com - ${uuid}`;
export const getProdDetailDescTextWithoutPrice = (title: string) => `Shop for ${title} and more at everyday discount price with FREE SHIPPING on all Products to celebrate PeasyDeal's Grant Opening!!`
export const getProdDetailDescText = (title: string, retailPrice: number, salePrice: number) => `£${salePrice} instead of £${retailPrice} for ${title} – save 36 % Shop for ${title} and more at everyday discount price with FREE SHIPPING on all Products to celebrate PeasyDeal's Grant Opening!!.`;

// SEO tracking page
export const getTrackingTitleText = () => 'Track Order | peasydeal.com';
export const getTrackingDescText = () => 'track your order delivering status with the order id. Order id was sent to your email address by contact@peasydeal.com after you\'ve made the payment.';

// SEO cart page
export const getCartTitleText = () => 'Shopping Cart| peasydeal.com';