import { expect } from 'vitest';
import { validateEmail, composeProductDetailURL, decomposeProductDetailURL } from "./utils";

test("validateEmail returns false for non-emails", () => {
  expect(validateEmail(undefined)).toBe(false);
  expect(validateEmail(null)).toBe(false);
  expect(validateEmail("")).toBe(false);
  expect(validateEmail("not-an-email")).toBe(false);
  expect(validateEmail("n@")).toBe(false);
});

test("validateEmail returns true for emails", () => {
  expect(validateEmail("kody@example.com")).toBe(true);
});

test("composeProductDetailURL returns correct URL", () => {
  const prodName = 'Women Swimwear Cover-up Linen Loose Beach Top'
  const productUUID = '7725810647266';
  const url = composeProductDetailURL({ productName: prodName, productUUID })
  expect(url).toEqual(`/product/Women-Swimwear-Cover-up-Linen-Loose-Beach-Top-i.${productUUID}`);
});

test('decompose url to retrieve product variation uuid', () => {
  const url = 'https://peasydeal.com/product/Women-Swimwear-Cover-up-Linen-Loose-Beach-Top-i.7725810647266'
  const decompURL = decomposeProductDetailURL(new URL(url));
  expect(decompURL.productUUID).toEqual('7725810647266');
})

test('decompose url but not able to retrieve variation uuid', () => {
  const url = 'https://google.com';
  const decompURL = decomposeProductDetailURL(new URL(url));
  expect(decompURL.productUUID).toEqual('');
});
