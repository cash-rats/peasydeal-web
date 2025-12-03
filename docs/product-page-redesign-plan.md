# Product Page Redesign Plan

## Objectives
1.  **Image Display**: Restrict the product image carousel to display only the `main_pic_url` (as the first image) and `shared_images`. Product variation images should **not** be displayed.
2.  **Carousel Behavior**: Disable the auto-scroll behavior that jumps to a variation-specific image upon page load or variation selection. The carousel should default to showing the `main_pic_url`.
3.  **Variation Selection UI**: Replace the current dropdown (`react-select`) with a set of elegant, clickable "tag/box" selectors for product variations.
4.  **Variation Hover Preview**: When a user hovers over a variation selector box, the main product image area (carousel) should temporarily update to display the specific image associated with that variation. Moving the mouse away should revert the image to its previous state (either the main pic or the currently selected variation's image if one was selected).

## Feasibility Analysis for Objective 4

### Requirement
Display the corresponding variation image in the main carousel/lightbox area when hovering over a variation tag.

### Technical Components involved
1.  **`ProductDetailContainer`**: This component renders the variation tags. It has access to `variationImages` (the list of all variation images) and the `productDetail.variations` list.
2.  **`ProductDetailSection`**: This component wraps the `PicsCarousel`. It currently receives `sharedPics` and `mainPicUrl`. It *does not* currently receive `variationImages` in the `combinedImages` logic we recently changed (we explicitly passed `[]` for `variationImages`).
3.  **`PicsCarousel` / `CarouselMinimal`**: This is the display component. It renders images based on the `data` prop (array of images). It controls which slide is active via internal state (`slide`).

### Challenges & Solutions

1.  **Image Availability**:
    *   **Challenge**: We recently modified `ProductDetailSection` to *exclude* variation images from the carousel's image list to prevent clutter and auto-scrolling.
    *   **Solution**: To show a variation image on hover, that image *must* be available to the carousel component. We cannot easily "inject" a temporary image into the carousel's internal list without causing a re-render or index shift that might feel jumpy.
    *   **Alternative**: A cleaner approach might be to have a separate "Preview Overlay" or to dynamically update the *first* slide (the Main Pic slot) to be the hovered variation image.
    *   **Better Solution**:
        *   Pass a `previewImage` prop to `ProductDetailSection` -> `PicsCarousel` -> `CarouselMinimal`.
        *   If `previewImage` is present, `CarouselMinimal` forces its display (e.g., overlaying the current slide or temporarily swapping the 0-index image).
        *   However, `CarouselMinimal` is built on a list of slides. A simple way is to control the `slide` index. If we add all variation images back to the carousel but *hide* their thumbnails (or keep them hidden from the main flow), we can programmatically scroll to them. But we explicitly wanted to remove them.
        *   **Proposed Strategy**:
            *   State in `ProductDetailContainer`: `hoveredVariationImage`.
            *   On hover of a tag: Find the matching image in `variationImages` and set `hoveredVariationImage`.
            *   Pass this `hoveredVariationImage` down to `ProductDetailSection`.
            *   In `ProductDetailSection`, if `hoveredVariationImage` exists, we can:
                *   Option A: Prepend it to the list passed to `PicsCarousel` (might cause a re-render flash).
                *   Option B: Pass it as a specific "override" prop to `PicsCarousel`.
            *   **Refined Strategy**:
                *   Modify `PicsCarousel` / `CarouselMinimal` to accept a `forcedImage` prop.
                *   If `forcedImage` is provided, the carousel displays *that* single image instead of the standard slider, OR the slider temporarily jumps to show it.
                *   Given `CarouselMinimal` is complex, a simpler UI trick might be to render a simple `<img>` overlay *on top* of the carousel when `hoveredVariationImage` is active. This avoids messing with the carousel's internal index logic and provides an instant "preview" feel.

### Implementation Plan (Objective 4)

1.  **State Management**:
    *   Add `hoveredVariationUUID` state to `ProductDetailContainer`.
    *   Add `onMouseEnter` and `onMouseLeave` handlers to the variation buttons.

2.  **Image Lookup**:
    *   In `ProductDetailContainer`, derive `hoveredImage` by finding the image in `variationImages` that matches `hoveredVariationUUID`.

3.  **Prop Propagation**:
    *   Pass `hoveredImage` (ProductImg | null) to `ProductDetailSection`.

4.  **Display Logic (The Overlay Approach)**:
    *   Modify `ProductDetailSection` (or `PicsCarousel`) to accept `previewImage`.
    *   Render a simple, absolute-positioned `<img>` on top of the `PicsCarousel` when `previewImage` is present.
    *   This ensures instant feedback, no carousel index jumping, and zero disruption to the underlying carousel state.

### Feasibility Verdict
**High**. The "Overlay" approach is low-risk, performant, and decouples the "hover preview" from the complex carousel logic we just simplified. It meets the user's visual requirement without re-introducing the "scroll-to-variation" complexity we just removed.

## Implementation Steps (Updated)

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
*   **Hover Logic (New)**:
    *   Add `hoveredVariationImage` state.
    *   On button hover, find corresponding image from `variationImages`.
    *   Pass `hoveredVariationImage` to `ProductDetailSection`.

### 3. ProductDetailSection Refactor
**File:** `app/routes/product.$prodId/components/ProductDetailSection/index.tsx`

*   **Props Interface**: Add `mainPicUrl` (string | undefined) to props.
*   **Props Interface**: Add `previewImage` (string | undefined) to props.
*   **Image Logic**:
    *   Construct the `sharedImages` array passed to `PicsCarousel`.
    *   Prepend `mainPicUrl` to the existing `sharedPics`.
        *   Format: `{ url: mainPicUrl, variation_uuid: '' }`.
    *   **Crucial**: Pass an empty array `[]` for the `variationImages` prop of `PicsCarousel`.
*   **Overlay Logic (New)**:
    *   If `previewImage` prop is present, render an absolute positioned `<img>` over the carousel area to show the preview.

### 4. Verification
*   Verify the carousel starts at the first image (Main Pic).
*   Verify the carousel contains Main Pic + Shared Images only.
*   Verify clicking variation tags correctly updates the `variation` state.
*   Verify hovering variation tags temporarily shows the variation image.
