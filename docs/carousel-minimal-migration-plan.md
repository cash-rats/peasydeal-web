# CarouselMinimal Migration Plan: Chakra to Shadcn/Radix

## Objective
Replace the Chakra UI dependency in `@app/components/Carousel/CarouselMinimal.tsx` with standard React components, Tailwind CSS, and Shadcn/Radix primitives, aligning with the project's migration goal.

## Current Chakra Usage
The component currently uses `IconButton` from `@chakra-ui/react`. It serves three purposes:
1.  **Previous Slide Button**: `<BiChevronLeft />`
2.  **Next Slide Button**: `<BiChevronRight />`
3.  **Zoom Photo Button**: `<VscZoomIn />`

## Migration Strategy

### 1. Identify Replacement Component
We will replace the Chakra `IconButton` with a standard HTML `<button>` element or a custom `Button` component (if available in `~/components/ui/button`), styled with Tailwind CSS to replicate the existing look and feel.

**Existing Style:**
-   Absolute positioning (`absolute top-1/2`, `absolute bottom-[10px]`)
-   White background (`bg-white`)
-   Padding (`p-2`)
-   Rounded full (`rounded-full`)
-   Border (`border-[1px] border-slate-200`)
-   Hover effect (`hover:bg-[rgba(255,255,255,0.7)]`)
-   Transitions (`transition-all duration-300 ease-in-out`)

**Proposed Tailwind Classes:**
`absolute z-10 flex items-center justify-center bg-white border border-slate-200 rounded-full p-2 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-400` (plus specific positioning classes).

### 2. Implementation Steps

1.  **Remove Imports**: Remove `import { IconButton } from '@chakra-ui/react'`.
2.  **Create Helper Component (Optional but cleaner)**: Define a local `CarouselButton` component to encapsulate the repeated styles.
    ```tsx
    const CarouselButton = ({ onClick, icon, className, ariaLabel }) => (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`absolute z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all hover:bg-gray-100 focus:outline-none ${className}`}
      >
        {icon}
      </button>
    );
    ```
3.  **Replace `IconButton` Instances**:
    *   **Prev Slide**:
        *   **Old**: `IconButton` with `icon={<BiChevronLeft />}`.
        *   **New**: `<button>` with `BiChevronLeft` inside.
        *   **Position**: `left-2 top-1/2 -translate-y-1/2` (adjusting for the existing `mt-[-22px]` which was roughly half height).
    *   **Next Slide**:
        *   **Old**: `IconButton` with `icon={<BiChevronRight />}`.
        *   **New**: `<button>` with `BiChevronRight` inside.
        *   **Position**: `right-2 top-1/2 -translate-y-1/2`.
    *   **Zoom**:
        *   **Old**: `IconButton` with `icon={<VscZoomIn />}`.
        *   **New**: `<button>` with `VscZoomIn` inside.
        *   **Position**: `bottom-2 right-2`.

4.  **Verify Styling**: Ensure the new buttons visually match the previous ones (circular, white, shadowed/bordered).

5.  **Clean Up**: Ensure no other Chakra dependencies remain in the file.

## Verification
-   Check that the carousel navigation works (next/prev).
-   Check that the zoom functionality works (lightbox opens).
-   Verify the button styles are consistent with the previous design.
-   Run `npm run typecheck` to ensure no errors.
