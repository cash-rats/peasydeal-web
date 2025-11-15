/**
 * Session type definitions for client-side use.
 *
 * This file contains ONLY type definitions with no server-side dependencies,
 * making it safe to import in client-side code (components, hooks, utils).
 *
 * Server-side session implementations should import from this file
 * to ensure type consistency across the codebase.
 */

import type { CookieStorablePriceInfo } from '~/shared/cart';
import type { Product } from '~/shared/types';

// ============================================================================
// Shopping Cart Types
// ============================================================================

export type ShoppingCart = {
  [variationUUID: string]: ShoppingCartItem;
};

export type ShoppingCartItem = {
  salePrice: string;
  retailPrice: string;
  productUUID: string;
  variationUUID: string;
  tagComboTags: string;

  // product variation does not have "main_pic" yet, thus, we take the first product image to be displayed in shopping cart.
  image: string;
  quantity: string;
  title: string;
  specName: string;
  purchaseLimit: string;
  discountReason?: string;
  added_time?: string;
};

// ============================================================================
// Transaction Types
// ============================================================================

export interface TransactionObject {
  promo_code?: string | null;
  price_info: CookieStorablePriceInfo;
}

// ============================================================================
// Product List Types
// ============================================================================

export type ProductListInfo = {
  page: number;
  products: Product[];
};

export type CategoryProducts = {
  [key: string]: ProductListInfo;
};
