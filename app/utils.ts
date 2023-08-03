import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import getEnvSource from '~/utils/get_env_source';
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

export const getCanonicalDomain = (): string => getEnvSource()?.DOMAIN || 'https://peasydeal.com';
export const getLogoURL = () => `${getCanonicalDomain()}/images/peasy_deal_words.png`

/* composeProductDetailURL takes product name and url to compose a product detail url in following format:
 * `https://peasydeal.com/product/some-google-product-i.{PRODUCT_UUID}`
 *
 *   - convert all characters to lowercase
 *   - convert all ' ' to '-'
 *   - convert all '/' to '_'
 *   - convert apostrophe ' to '-'
 *   - encode special characters of productName using `encodeURIComponent`
 *
 * @TOOD
 * This function should be deprecated in favor of product slug.
 */
export const composeProductDetailURL = ({ productName, productUUID }: { productName: string, productUUID: string }) => {
  let prodName = productName.replace(/\s+/g, '-');
  prodName = prodName.toLowerCase();
  prodName = prodName.replace(/\//g, '_');
  prodName = prodName.replace(/'/g, '-');
  const url = `/product/${encodeURIComponent(prodName)}-i.${productUUID}`;
  return url;
}

export const decomposeProductDetailURL = (url: URL) => {
  const [productName, productUUID = ''] = url.pathname.split('-i.');
  return { productName, productUUID };
}
