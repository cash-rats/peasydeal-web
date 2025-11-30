# Product Page Redesign Plan

## Objectives
1.  **Image Display**: Restrict the product image carousel to display only the `main_pic_url` (as the first image) and `shared_images`. Product variation images should **not** be displayed.
2.  **Carousel Behavior**: Disable the auto-scroll behavior that jumps to a variation-specific image upon page load or variation selection. The carousel should default to showing the `main_pic_url`.
3.  **Variation Selection UI**: Replace the current dropdown (`react-select`) with a set of elegant, clickable "tag/box" selectors for product variations.

## Implementation Steps

### 1. Type Definitions
**File:** `app/routes/product.$prodId/types.ts`
*   Verify `ProductDetail` interface correctly types `main_pic_url`. It is currently optional. We will treat it as a source for the first image.

### 2. ProductDetailContainer Refactor
**File:** `app/routes/product.$prodId/components/ProductDetailContainer/index.tsx`

*   **Props**: Ensure `productDetail` is used to access `main_pic_url`.
*   **Pass Prop**: Pass `productDetail.main_pic_url` to the `ProductDetailSection` component.
*   **UI Replacement**:
    *   Remove `<Select />` component.
    *   Implement a list of clickable elements iterating over `productDetail.variations`.
    *   **Styling**:
        *   Container: `flex flex-wrap gap-2`.
        *   Item (Inactive): White background, 1px solid gray border, text-gray-700, rounded.
        *   Item (Active/Selected): Pink background (`#D02E7D`) or border, white text (or pink text with border), bold.
        *   Interaction: `onClick` triggers `onChangeVariation`.

### 3. ProductDetailSection Refactor
**File:** `app/routes/product.$prodId/components/ProductDetailSection/index.tsx`

*   **Props Interface**: Add `mainPicUrl` (string | undefined) to props.
*   **Image Logic**:
    *   Construct the `sharedImages` array passed to `PicsCarousel`.
    *   Prepend `mainPicUrl` to the existing `sharedPics`.
        *   Format: `{ url: mainPicUrl, variation_uuid: '' }`.
    *   **Crucial**: Pass an empty array `[]` for the `variationImages` prop of `PicsCarousel`.
        *   This ensures variation images are excluded.
        *   This effectively disables the "scroll-to-variation" behavior in `CarouselMinimal` because no images will match the selected variation UUID.

### 4. Verification
*   Verify the carousel starts at the first image (Main Pic).
*   Verify the carousel contains Main Pic + Shared Images only.
*   Verify clicking variation tags correctly updates the `variation` state (price, quantity limit, etc.).
*   Verify no console errors regarding missing props or types.
